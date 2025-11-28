import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Track, tracks } from './track.entity';
import { CreateTrackDto } from './dto/create-track';
import { UpdateTrackDto } from './dto/update-track';

@Injectable()
export class TrackService {
  getAllTracks(): Track[] {
    return tracks;
  }

  getTrackById(id: string): Track | undefined {
    const track = tracks.find((t) => t.id === id);
    return track;
  }

  create(dto: CreateTrackDto): Track {
    const track: Track = {
      id: uuid(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };

    tracks.push(track);
    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track | null {
    const track = this.getTrackById(id);
    if (!track) return null;

    if (dto.name !== undefined) {
      track.name = dto.name;
    }

    if (dto.artistId !== undefined) {
      track.artistId = dto.artistId;
    }

    if (dto.albumId !== undefined) {
      track.albumId = dto.albumId;
    }

    if (dto.duration !== undefined) {
      track.duration = dto.duration;
    }

    return track;
  }

  remove(id: string): boolean {
    const index = tracks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    tracks.splice(index, 1);
    return true;
  }
}
