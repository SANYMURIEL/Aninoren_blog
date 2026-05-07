import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)          // Seul l'admin peut uploader
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      // Stockage en mémoire (buffer) — pas de fichier temporaire sur disque
      storage: undefined,
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
      fileFilter: (_req, file, callback) => {
        // N'accepter que les images
        if (!file.mimetype.startsWith('image/')) {
          return callback(
            new BadRequestException('Seules les images sont acceptées'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @ApiOperation({ summary: '🔒 Uploader une image vers Cloudinary (admin)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image à uploader (jpg, png, webp — max 5MB)',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploadée, URL retournée',
    schema: {
      example: {
        url: 'https://res.cloudinary.com/ton-cloud/image/upload/v1234/aninoren/posts/abc123.webp',
        public_id: 'aninoren/posts/abc123',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Fichier invalide ou trop lourd' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Aucun fichier reçu');
    }

    const result = await this.cloudinaryService.uploadImage(file);

    // On retourne l'URL sécurisée + le public_id (utile pour supprimer plus tard)
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }
}
