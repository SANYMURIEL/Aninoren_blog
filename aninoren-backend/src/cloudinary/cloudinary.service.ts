import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  // Upload un fichier buffer vers Cloudinary
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    // Vérifier que c'est bien une image
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Le fichier doit être une image (jpg, png, webp...)');
    }

    // Limite de taille : 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('L\'image ne doit pas dépasser 5MB');
    }

    return new Promise((resolve, reject) => {
      // On utilise un stream pour envoyer le buffer directement à Cloudinary
      // sans sauvegarder le fichier sur le disque
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'aninoren/posts',      // Dossier dans ton compte Cloudinary
          transformation: [
            { width: 1200, crop: 'limit' }, // Redimensionne si trop grande
            { quality: 'auto' },            // Optimise la qualité automatiquement
            { fetch_format: 'auto' },       // Convertit en webp si supporté
          ],
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(error.message));
          if (!result) return reject(new BadRequestException('Upload échoué'));
          resolve(result);
        },
      );

      // Convertir le buffer en stream lisible et le piper vers Cloudinary
      const readable = new Readable();
      readable.push(file.buffer);
      readable.push(null);
      readable.pipe(uploadStream);
    });
  }

  // Supprimer une image de Cloudinary via son public_id
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
