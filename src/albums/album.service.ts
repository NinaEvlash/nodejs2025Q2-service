import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album';
import { UpdateAlbumDto } from './dto/update-album';
import { Artist } from 'src/artists/artist.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private repo: Repository<Album>,
  ) {}
  async getAllAlbums() {
    const albums = await this.repo.find();
    return albums;
  }

  async getAlbumById(id: string) {
    const album = await this.repo.findOne({ where: { id } });
    return album;
  }

  async create(dto: CreateAlbumDto) {
    const album = this.repo.create({
      name: dto.name,
      year: dto.year,
      artist: dto.artistId ? ({ id: dto.artistId } as Artist) : null,
    });

    await this.repo.save(album);
    return album;
  }

  async update(id: string, dto: UpdateAlbumDto) {
    const album = await this.repo.findOne({ where: { id } });
    if (!album) return null;

    if (dto.name !== undefined) {
      album.name = dto.name;
    }

    if (dto.year !== undefined) {
      album.year = dto.year;
    }

    if (dto.artistId !== undefined) {
      album.artist = dto.artistId ? ({ id: dto.artistId } as Artist) : null;
    }
    await this.repo.save(album);
    return album;
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
