import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { validate as isUUID } from 'uuid';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album';
import { UpdateAlbumDto } from './dto/update-album';
import { artists } from '../artists/artist.entity';

@Controller('album')
export class AlbumController {
  constructor(private service: AlbumService) {}

  @Get()
  getAll() {
    return this.service.getAllAlbums();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const album = this.service.getAlbumById(id);
    if (!album) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateAlbumDto) {
    if (!dto.name || dto.year === undefined) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (dto.artistId !== null && dto.artistId !== undefined) {
      if (!isUUID(dto.artistId)) {
        throw new HttpException('Invalid artistId', HttpStatus.BAD_REQUEST);
      }

      const exists = artists.some((a) => a.id === dto.artistId);
      if (!exists) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAlbumDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
    }

    if (dto.artistId !== undefined && dto.artistId !== null) {
      if (!isUUID(dto.artistId)) {
        throw new HttpException('Invalid artistId', HttpStatus.BAD_REQUEST);
      }
      const exists = artists.some((a) => a.id === dto.artistId);
      if (!exists) {
        throw new HttpException(
          'Artist does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const result = this.service.update(id, dto);

    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }
    const ok = this.service.remove(id);
    if (!ok) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
