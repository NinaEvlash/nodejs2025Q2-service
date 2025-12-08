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
import { validate as isUUID } from 'uuid';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Get()
  async getAll() {
    return this.service.getAll();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.addTrack(id);
    return;
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.removeTrack(id);
    return;
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.addAlbum(id);
    return;
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.removeAlbum(id);
    return;
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.addArtist(id);
    return;
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
    }

    await this.service.removeArtist(id);
    return;
  }
}
