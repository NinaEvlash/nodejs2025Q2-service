import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track';
import { UpdateTrackDto } from './dto/update-track';
import { Album } from '../albums/album.entity';
import { Artist } from '../artists/artist.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private repo: Repository<Track>,
  ) {}

  private map(track: Track) {
    return {
      id: track.id,
      name: track.name,
      duration: track.duration,
      artistId: track.artistId ?? null,
      albumId: track.albumId ?? null,
    };
  }
  async getAllTracks() {
    const tracks = await this.repo.find({ relations: ['artist', 'album'] });
    return tracks.map((t) => this.map(t));
  }

  async getTrackById(id: string) {
    const track = await this.repo.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    return track ? this.map(track) : null;
  }

  async create(dto: CreateTrackDto) {
    const track = this.repo.create({
      name: dto.name,
      duration: dto.duration,
      artistId: dto.artistId ?? null,
      albumId: dto.albumId ?? null,
      artist: dto.artistId ? ({ id: dto.artistId } as Artist) : null,
      album: dto.albumId ? ({ id: dto.albumId } as Album) : null,
    });

    await this.repo.save(track);
    return this.map(track);
  }

  async update(id: string, dto: UpdateTrackDto) {
    const track = await this.repo.findOne({
      where: { id },
      relations: ['artist', 'album'],
    });
    if (!track) return null;

    if (dto.name !== undefined) {
      track.name = dto.name;
    }

    if (dto.artistId !== undefined) {
      track.artist = dto.artistId ? ({ id: dto.artistId } as Artist) : null;
    }

    if (dto.albumId !== undefined) {
      track.album = dto.albumId ? ({ id: dto.albumId } as Album) : null;
    }

    if (dto.duration !== undefined) {
      track.duration = dto.duration;
    }

    await this.repo.save(track);
    return this.map(track);
  }

  async remove(id: string) {
    const result = await this.repo.delete(id);
    return result.affected > 0;
  }
}
