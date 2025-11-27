import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Artist, artists } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';

@Injectable()
export class ArtistService {
  getAllArtists(): Artist[] {
    return artists;
  }

  getArtistById(id: string): Artist | undefined {
    const artist = artists.find((a) => a.id === id);
    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: uuid(),
      name: dto.name,
      grammy: dto.grammy,
    };

    artists.push(artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto) {
    const artist = this.getArtistById(id);
    if (!artist) return null;
    artist.name = dto.name;
    artist.grammy = dto.grammy;

    return artist;
  }

  remove(id: string): boolean {
    const index = artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    artists.splice(index, 1);
    return true;
  }
}
