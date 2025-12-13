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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';

@Controller('track')
export class TrackController {
  constructor(
    private service: TrackService,
    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,
    @InjectRepository(Album)
    private albumRepo: Repository<Album>,
  ) {}

  @Get()
  async getAll() {
    return await this.service.getAllTracks();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const track = await this.service.getTrackById(id);
    if (!track) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTrackDto) {
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

      const exists = await this.artistRepo.findOne({
        where: { id: dto.artistId },
      });
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

      const exists = await this.albumRepo.findOne({
        where: { id: dto.albumId },
      });
      if (!exists) {
        throw new HttpException('Album does not exist', HttpStatus.BAD_REQUEST);
      }
    }

    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateTrackDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId', HttpStatus.BAD_REQUEST);
    }

    if (dto.artistId !== null && dto.artistId !== undefined) {
      if (!isUUID(dto.artistId)) {
        throw new HttpException('Invalid artistId', HttpStatus.BAD_REQUEST);
      }

      const exists = await this.artistRepo.findOne({
        where: { id: dto.artistId },
      });
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

      const exists = await this.albumRepo.findOne({
        where: { id: dto.albumId },
      });
      if (!exists) {
        throw new HttpException('Album does not exist', HttpStatus.BAD_REQUEST);
      }
    }

    const result = await this.service.update(id, dto);

    if (!result) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const ok = await this.service.remove(id);
    if (!ok) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return;
  }
}
