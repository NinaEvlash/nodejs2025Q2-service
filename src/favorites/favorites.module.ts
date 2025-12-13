import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorites.entity';
import { Track } from '../tracks/track.entity';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Track, Artist, Album])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
