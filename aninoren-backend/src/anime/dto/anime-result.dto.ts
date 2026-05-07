import { ApiProperty } from '@nestjs/swagger';

// Ce que le frontend reçoit — seulement l'essentiel
export class AnimeResultDto {
  @ApiProperty({ example: 16498 })
  mal_id: number;

  @ApiProperty({ example: 'Shingeki no Kyojin' })
  titre: string;

  @ApiProperty({ example: 'https://cdn.myanimelist.net/images/anime/...' })
  image: string;

  @ApiProperty({ example: 'Des siècles après, l\'humanité vit derrière des murs...' })
  synopsis: string;

  @ApiProperty({ example: 9.0 })
  score: number;

  @ApiProperty({ example: 2013 })
  annee: number | null;
}
