import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnimeController } from './anime.controller';
import { AnimeService } from './anime.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 8000,       // 8s max par requête Jikan
      maxRedirects: 3,
    }),
  ],
  controllers: [AnimeController],
  providers: [AnimeService],
})
export class AnimeModule {}
