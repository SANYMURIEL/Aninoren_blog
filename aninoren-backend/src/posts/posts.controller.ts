import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ─── Routes publiques (lecture) ───────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les articles (public)' })
  @ApiQuery({ name: 'anime', required: false, type: Number, description: 'Filtrer par ID anime Jikan' })
  findAll(@Query('anime') anime?: string) {
    if (anime) {
      return this.postsService.findByAnime(parseInt(anime, 10));
    }
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un article par son ID (public)' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du post' })
  @ApiResponse({ status: 200, description: 'Article trouvé' })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  // ─── Routes protégées (écriture — admin seulement) ────────────────────────

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '🔒 Créer un article (admin)' })
  @ApiResponse({ status: 201, description: 'Article créé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '🔒 Mettre à jour un article (admin)' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du post' })
  @ApiResponse({ status: 200, description: 'Article mis à jour' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '🔒 Supprimer un article (admin)' })
  @ApiParam({ name: 'id', description: 'ID MongoDB du post' })
  @ApiResponse({ status: 200, description: 'Article supprimé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
