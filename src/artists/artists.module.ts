import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track])],
  controllers: [ArtistController],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistsModule {}
