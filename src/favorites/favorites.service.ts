import { Injectable } from '@nestjs/common';
import { favorites } from './favorites.entity';
import { artists } from '../artists/artist.entity';
import { albums } from '../albums/album.entity';
import { tracks } from '../tracks/track.entity';

@Injectable()
export class FavoritesService {
  getAll() {
    return {
      artists: artists.filter((a) => favorites.artists.includes(a.id)),
      albums: albums.filter((a) => favorites.albums.includes(a.id)),
      tracks: tracks.filter((t) => favorites.tracks.includes(t.id)),
    };
  }

  addTrack(id: string) {
    favorites.tracks.push(id);
  }

  removeTrack(id: string) {
    favorites.tracks = favorites.tracks.filter((tid) => tid !== id);
  }

  addAlbum(id: string) {
    favorites.albums.push(id);
  }

  removeAlbum(id: string) {
    favorites.albums = favorites.albums.filter((aid) => aid !== id);
  }

  addArtist(id: string) {
    favorites.artists.push(id);
  }

  removeArtist(id: string) {
    favorites.artists = favorites.artists.filter((aid) => aid !== id);
  }
}
