import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AnimeService } from './anime.service';

@ApiTags('anime')
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Get('search')
  @ApiOperation({ summary: 'Rechercher un anime via Jikan API (public)' })
  @ApiQuery({ name: 'q', required: true, description: 'Nom de l\'anime à rechercher' })
  @ApiResponse({ status: 200, description: 'Liste des animes trouvés (titre, image, synopsis)' })
  @ApiResponse({ status: 400, description: 'Requête trop courte' })
  @ApiResponse({ status: 429, description: 'Rate limit Jikan dépassé' })
  search(@Query('q') query: string) {
    return this.animeService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un anime par son ID MAL (public)' })
  @ApiParam({ name: 'id', description: 'ID MyAnimeList de l\'anime' })
  @ApiResponse({ status: 200, description: 'Détails de l\'anime' })
  @ApiResponse({ status: 404, description: 'Anime introuvable' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.animeService.findById(id);
  }
}
