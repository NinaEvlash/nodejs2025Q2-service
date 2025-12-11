import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import { Favorite } from './favorites.entity';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';

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
    const trackFavs = await this.favoritesRepo.find({
      where: { trackId: Not(IsNull()) },
    });

    const albumFavs = await this.favoritesRepo.find({
      where: { albumId: Not(IsNull()) },
    });

    const artistFavs = await this.favoritesRepo.find({
      where: { artistId: Not(IsNull()) },
    });

    return {
      tracks: (
        await Promise.all(
          trackFavs.map((fav) =>
            this.trackRepo.findOne({ where: { id: fav.trackId } }),
          ),
        )
      ).filter(Boolean),

      albums: (
        await Promise.all(
          albumFavs.map((fav) =>
            this.albumRepo.findOne({ where: { id: fav.albumId } }),
          ),
        )
      ).filter(Boolean),

      artists: (
        await Promise.all(
          artistFavs.map((fav) =>
            this.artistRepo.findOne({ where: { id: fav.artistId } }),
          ),
        )
      ).filter(Boolean),
    };
  }

  async addTrack(id: string) {
    const exists = await this.trackRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ trackId: id });
    return this.getAll();
  }

  async removeTrack(id: string) {
    await this.favoritesRepo.delete({ trackId: id });
    return this.getAll();
  }

  async addAlbum(id: string) {
    const exists = await this.albumRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ albumId: id });
    return this.getAll();
  }

  async removeAlbum(id: string) {
    await this.favoritesRepo.delete({ albumId: id });
    return this.getAll();
  }

  async addArtist(id: string) {
    const exists = await this.artistRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ artistId: id });
    return this.getAll();
  }

  async removeArtist(id: string) {
    await this.favoritesRepo.delete({ artistId: id });
    return this.getAll();
  }
}
