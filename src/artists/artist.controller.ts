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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist';
import { UpdateArtistDto } from './dto/update-artist';

@Controller('artist')
export class ArtistController {
  constructor(private service: ArtistService) {}

  @Get()
  async getAll() {
    return await this.service.getAllArtists();
  }

  @Get(':id')
  async getOne(@Param('id') artistId: string) {
    if (!isUUID(artistId)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    const artist = await this.service.getArtistById(artistId);
    if (!artist) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateArtistDto) {
    if (
      !dto ||
      typeof dto.name !== 'string' ||
      typeof dto.grammy !== 'boolean'
    ) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.service.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateArtistDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid uuid', HttpStatus.BAD_REQUEST);
    }

    if (
      !dto ||
      typeof dto.name !== 'string' ||
      typeof dto.grammy !== 'boolean'
    ) {
      throw new HttpException('Invalid dto', HttpStatus.BAD_REQUEST);
    }

    const result = await this.service.update(id, dto);

    if (result === null) {
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
