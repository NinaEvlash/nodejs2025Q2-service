import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album';
import { UpdateAlbumDto } from './dto/update-album';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private repo: Repository<Album>,
  ) {}

  private map(album: Album) {
    return {
      id: album.id,
      name: album.name,
      year: album.year,
      artistId: album.artistId ?? null,
    };
  }

  async getAllAlbums() {
    const albums = await this.repo.find({ relations: ['artist'] });
    return albums.map((a) => this.map(a));
  }

  async getAlbumById(id: string) {
    const album = await this.repo.findOne({
      where: { id },
      relations: ['artist'],
    });
    return album ? this.map(album) : null;
  }

  async create(dto: CreateAlbumDto) {
    const album = this.repo.create({
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId ?? null,
      artist: dto.artistId ? ({ id: dto.artistId } as Artist) : null,
    });

    await this.repo.save(album);
    return this.map(album);
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const album = await this.repo.findOne({
      where: { id },
      relations: ['artist'],
    });
    if (!album) return null;

    if (dto.name !== undefined) {
      album.name = dto.name;
    }

    if (dto.year !== undefined) {
      album.year = dto.year;
    }

    if (dto.artistId !== undefined) {
      album.artistId = dto.artistId ?? null;
      album.artist = dto.artistId ? ({ id: dto.artistId } as Artist) : null;
    }
    await this.repo.save(album);
    return this.map(album);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
