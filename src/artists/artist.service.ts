import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Artist, artists } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';
import { albums } from '../albums/album.entity';
import { tracks } from '../tracks/track.entity';
import { favorites } from '../favorites/favorites.entity';

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

  update(id: string, dto: UpdateArtistDto): Artist | null {
    const artist = this.getArtistById(id);
    if (!artist) return null;

    if (dto.name !== undefined) {
      artist.name = dto.name;
    }

    if (dto.grammy !== undefined) {
      artist.grammy = dto.grammy;
    }

    return artist;
  }

  remove(id: string): boolean {
    const index = artists.findIndex((a) => a.id === id);
    if (index === -1) return false;
    artists.splice(index, 1);
    albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    favorites.artists = favorites.artists.filter((aid) => aid !== id);
    return true;
  }
}
