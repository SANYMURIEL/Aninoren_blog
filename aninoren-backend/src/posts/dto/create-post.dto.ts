import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Mon avis sur Attack on Titan', description: 'Titre de l\'article' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre ne peut pas être vide' })
  @MaxLength(200, { message: 'Le titre ne peut pas dépasser 200 caractères' })
  titre: string;

  @ApiProperty({ example: 'Un anime incroyable qui...', description: 'Contenu de l\'article' })
  @IsString()
  @IsNotEmpty({ message: 'Le contenu ne peut pas être vide' })
  contenu: string;

  @ApiProperty({ example: 16498, description: 'ID Jikan de l\'anime associé' })
  @IsNumber()
  @Min(1, { message: 'L\'ID anime doit être un nombre positif' })
  id_anime_jikan: number;

  @ApiProperty({ example: 'Shingeki no Kyojin', description: 'Titre de l\'anime' })
  @IsString()
  @IsNotEmpty({ message: 'Le titre de l\'anime ne peut pas être vide' })
  anime_titre: string;

  @ApiPropertyOptional({ example: 'https://res.cloudinary.com/...', description: 'URL de l\'image de couverture' })
  @IsOptional()
  @IsUrl({}, { message: 'L\'image_url doit être une URL valide' })
  image_url?: string;
}
