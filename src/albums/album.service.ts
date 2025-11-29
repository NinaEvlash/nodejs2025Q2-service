import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Album, albums } from './album.entity';
import { CreateAlbumDto } from './dto/create-album';
import { UpdateAlbumDto } from './dto/update-album';
import { tracks } from '../tracks/track.entity';
import { favorites } from '../favorites/favorites.entity';

@Injectable()
export class AlbumService {
  getAllAlbums(): Album[] {
    return albums;
  }

  getAlbumById(id: string): Album | undefined {
    const album = albums.find((a) => a.id === id);
    return album;
  }

  create(dto: CreateAlbumDto): Album {
    const album: Album = {
      id: uuid(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };

    albums.push(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album | null {
    const album = this.getAlbumById(id);
    if (!album) return null;

    if (dto.name !== undefined) {
      album.name = dto.name;
    }

    if (dto.year !== undefined) {
      album.year = dto.year;
    }

    if (dto.artistId !== undefined) {
      album.artistId = dto.artistId;
    }

    return album;
  }

  remove(id: string): boolean {
    const index = albums.findIndex((a) => a.id === id);
    if (index === -1) return false;
    albums.splice(index, 1);
    tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });

    favorites.albums = favorites.albums.filter((aid) => aid !== id);

    return true;
  }
}
