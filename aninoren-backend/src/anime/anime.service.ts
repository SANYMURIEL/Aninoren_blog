import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AnimeResultDto } from './dto/anime-result.dto';

@Injectable()
export class AnimeService {
  private readonly jikanUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.jikanUrl = this.configService.get<string>('JIKAN_API_URL') || 'https://api.jikan.moe/v4';
  }

  async search(query: string): Promise<AnimeResultDto[]> {
    if (!query || query.trim().length < 2) {
      throw new HttpException(
        'La recherche doit contenir au moins 2 caractères',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.jikanUrl}/anime`, {
          params: { q: query, limit: 10, sfw: true },
        }),
      );

      // Mapper les données Jikan → seulement l'essentiel pour le frontend
      return response.data.data.map((anime: any): AnimeResultDto => ({
        mal_id: anime.mal_id,
        titre: anime.title,
        image: anime.images?.jpg?.image_url ?? null,
        synopsis: anime.synopsis
          ? anime.synopsis.substring(0, 300) + (anime.synopsis.length > 300 ? '...' : '')
          : 'Aucun synopsis disponible',
        score: anime.score ?? null,
        annee: anime.year ?? null,
      }));
    } catch (error) {
      // Si Jikan est down ou rate-limit
      if (error?.response?.status === 429) {
        throw new HttpException(
          'Trop de requêtes vers Jikan API, réessaie dans quelques secondes',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Erreur lors de la recherche anime',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async findById(id: number): Promise<AnimeResultDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.jikanUrl}/anime/${id}`),
      );

      const anime = response.data.data;
      return {
        mal_id: anime.mal_id,
        titre: anime.title,
        image: anime.images?.jpg?.image_url ?? null,
        synopsis: anime.synopsis ?? 'Aucun synopsis disponible',
        score: anime.score ?? null,
        annee: anime.year ?? null,
      };
    } catch (error) {
      throw new HttpException(
        `Anime avec l'ID ${id} introuvable`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
