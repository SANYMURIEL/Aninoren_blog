import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({ example: 'Mon avis sur Attack on Titan', description: 'Titre de l\'article' })
  @Prop({ required: true, trim: true, maxlength: 200 })
  titre: string;

  @ApiProperty({ example: 'Un anime incroyable...', description: 'Contenu de l\'article' })
  @Prop({ required: true })
  contenu: string;

  @ApiProperty({ example: 16498, description: 'ID Jikan de l\'anime associé' })
  @Prop({ required: true })
  id_anime_jikan: number;

  @ApiProperty({ example: 'Shingeki no Kyojin', description: 'Titre de l\'anime' })
  @Prop({ required: true, trim: true })
  anime_titre: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/...', description: 'URL de l\'image de couverture' })
  @Prop({ default: null })
  image_url: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
