import { PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

// PartialType rend tous les champs optionnels et hérite des décorateurs Swagger
export class UpdatePostDto extends PartialType(CreatePostDto) {}
