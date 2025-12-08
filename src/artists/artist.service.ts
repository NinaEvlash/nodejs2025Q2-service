import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private repo: Repository<Artist>,
  ) {}
  async getAllArtists() {
    const artists = await this.repo.find();
    return artists;
  }

  async getArtistById(id: string) {
    const artist = await this.repo.findOne({ where: { id } });
    return artist;
  }

  async create(dto: CreateArtistDto) {
    const artist = this.repo.create({
      name: dto.name,
      grammy: dto.grammy,
    });

    await this.repo.save(artist);
    return artist;
  }

  async update(id: string, dto: UpdateArtistDto) {
    const artist = await this.repo.findOne({ where: { id } });
    if (!artist) return null;

    if (dto.name !== undefined) {
      artist.name = dto.name;
    }

    if (dto.grammy !== undefined) {
      artist.grammy = dto.grammy;
    }
    await this.repo.save(artist);
    return artist;
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
