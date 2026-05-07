import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  // Récupérer tous les posts (du plus récent au plus ancien)
  async findAll(): Promise<PostDocument[]> {
    return this.postModel.find().sort({ createdAt: -1 }).exec();
  }

  // Récupérer un post par son ID MongoDB
  async findOne(id: string): Promise<PostDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`L'ID "${id}" n'est pas un ObjectId valide`);
    }

    const post = await this.postModel.findById(id).exec();
    if (!post) {
      throw new NotFoundException(`Post avec l'ID "${id}" introuvable`);
    }
    return post;
  }

  // Récupérer tous les posts liés à un anime Jikan
  async findByAnime(id_anime_jikan: number): Promise<PostDocument[]> {
    return this.postModel
      .find({ id_anime_jikan })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Créer un nouveau post
  async create(createPostDto: CreatePostDto): Promise<PostDocument> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  // Mettre à jour un post existant
  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`L'ID "${id}" n'est pas un ObjectId valide`);
    }

    const updated = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, { new: true, runValidators: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Post avec l'ID "${id}" introuvable`);
    }
    return updated;
  }

  // Supprimer un post
  async remove(id: string): Promise<{ message: string }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`L'ID "${id}" n'est pas un ObjectId valide`);
    }

    const deleted = await this.postModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Post avec l'ID "${id}" introuvable`);
    }
    return { message: `Post "${deleted.titre}" supprimé avec succès` };
  }
}
