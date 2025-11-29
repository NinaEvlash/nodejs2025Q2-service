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
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track';
import { UpdateTrackDto } from './dto/update-track';
import { artists } from '../artists/artist.entity';
import { albums } from 'src/albums/album.entity';

@Controller('track')
export class TrackController {
  constructor(private service: TrackService) {}

  @Get()
  getAll() {
    return this.service.getAllTracks();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const track = this.service.getTrackById(id);
    if (!track) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateTrackDto) {
    if (!dto.name || dto.duration === undefined) {
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

    if (dto.albumId !== null && dto.albumId !== undefined) {
      if (!isUUID(dto.albumId)) {
        throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
      }

      const exists = albums.some((a) => a.id === dto.albumId);
      if (!exists) {
        throw new HttpException('Album does not exist', HttpStatus.BAD_REQUEST);
      }
    }

    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId', HttpStatus.BAD_REQUEST);
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

    if (dto.albumId !== null && dto.albumId !== undefined) {
      if (!isUUID(dto.albumId)) {
        throw new HttpException('Invalid albumId', HttpStatus.BAD_REQUEST);
      }

      const exists = albums.some((a) => a.id === dto.albumId);
      if (!exists) {
        throw new HttpException('Album does not exist', HttpStatus.BAD_REQUEST);
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
