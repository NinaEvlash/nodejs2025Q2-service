import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validate as isUUID } from 'uuid';
import { tracks } from '../tracks/track.entity';
import { albums } from '../albums/album.entity';
import { artists } from '../artists/artist.entity';
import { favorites } from './favorites.entity';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favsService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favsService.getAll();
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId', HttpStatus.BAD_REQUEST);
    }

    const track = tracks.find((t) => t.id === id);
    if (!track) {
      throw new HttpException('Track does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.tracks.includes(id)) {
      this.favsService.addTrack(id);
    }

    return { message: 'Track added to favorites' };
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.tracks.includes(id)) {
      throw new HttpException(
        'Track is not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsService.removeTrack(id);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
    }

    const album = albums.find((a) => a.id === id);
    if (!album) {
      throw new HttpException('Album does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.albums.includes(id)) {
      this.favsService.addAlbum(id);
    }

    return { message: 'Album added to favorites' };
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.albums.includes(id)) {
      throw new HttpException(
        'Album is not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsService.removeAlbum(id);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artistId', HttpStatus.BAD_REQUEST);
    }

    const artist = artists.find((a) => a.id === id);
    if (!artist) {
      throw new HttpException('Artist does not exist', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.artists.includes(id)) {
      this.favsService.addArtist(id);
    }

    return { message: 'Artist added to favorites' };
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artistId', HttpStatus.BAD_REQUEST);
    }

    if (!favorites.artists.includes(id)) {
      throw new HttpException(
        'Artist is not found in favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    this.favsService.removeArtist(id);
  }
}
