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
    const tracksFav = await this.favoritesRepo.find({
      where: { trackId: Not(IsNull()) },
    });
    const albumsFav = await this.favoritesRepo.find({
      where: { albumId: Not(IsNull()) },
    });
    const artistsFav = await this.favoritesRepo.find({
      where: { artistId: Not(IsNull()) },
    });

    return {
      tracks: await Promise.all(
        tracksFav.map((fav) =>
          this.trackRepo.findOne({ where: { id: fav.trackId } }),
        ),
      ),
      albums: await Promise.all(
        albumsFav.map((fav) =>
          this.albumRepo.findOne({ where: { id: fav.albumId } }),
        ),
      ),
      artists: await Promise.all(
        artistsFav.map((fav) =>
          this.artistRepo.findOne({ where: { id: fav.artistId } }),
        ),
      ),
    };
  }

  async addTrack(id: string) {
    const exists = await this.trackRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ trackId: id });
  }

  async removeTrack(id: string) {
    await this.favoritesRepo.delete({ trackId: id });
  }

  async addAlbum(id: string) {
    const exists = await this.albumRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ albumId: id });
  }

  async removeAlbum(id: string) {
    await this.favoritesRepo.delete({ albumId: id });
  }

  async addArtist(id: string) {
    const exists = await this.artistRepo.findOne({ where: { id } });
    if (!exists) throw new UnprocessableEntityException();

    await this.favoritesRepo.save({ artistId: id });
  }

  async removeArtist(id: string) {
    await this.favoritesRepo.delete({ artistId: id });
  }
}
