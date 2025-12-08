import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Favorite } from './favorites.entity';
import { Artist } from 'src/artists/artist.entity';
import { Album } from 'src/albums/album.entity';
import { Track } from 'src/tracks/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoritesRepo: Repository<Favorite>,

    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,

    @InjectRepository(Album)
    private albumRepo: Repository<Album>,

    @InjectRepository(Track)
    private trackRepo: Repository<Track>,
  ) {}

  async getAll() {
    const tracks = await this.favoritesRepo.find({
      where: { trackId: Not(null) },
    });
    const albums = await this.favoritesRepo.find({
      where: { albumId: Not(null) },
    });
    const artists = await this.favoritesRepo.find({
      where: { artistId: Not(null) },
    });

    return {
      tracks: await Promise.all(
        tracks.map((fav) =>
          this.trackRepo.findOne({ where: { id: fav.trackId } }),
        ),
      ),
      albums: await Promise.all(
        albums.map((fav) =>
          this.albumRepo.findOne({ where: { id: fav.albumId } }),
        ),
      ),
      artists: await Promise.all(
        artists.map((fav) =>
          this.artistRepo.findOne({ where: { id: fav.artistId } }),
        ),
      ),
    };
  }

  async addTrack(id: string) {
    await this.favoritesRepo.save({ trackId: id });
  }

  async removeTrack(id: string) {
    await this.favoritesRepo.delete({ trackId: id });
  }

  async addAlbum(id: string) {
    await this.favoritesRepo.save({ albumId: id });
  }

  async removeAlbum(id: string) {
    await this.favoritesRepo.delete({ albumId: id });
  }

  async addArtist(id: string) {
    await this.favoritesRepo.save({ artistId: id });
  }

  async removeArtist(id: string) {
    await this.favoritesRepo.delete({ artistId: id });
  }
}
