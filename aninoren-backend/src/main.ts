import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS pour le frontend Next.js
  // On retire le slash final s'il est présent pour éviter les erreurs CORS
  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3001').replace(/\/$/, '');
  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Validation globale des DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('AniNoren API')
    .setDescription('API du blog anime AniNoren — Posts, Anime Search, Upload')
    .setVersion('1.0')
    .addTag('auth', 'Authentification admin')
    .addTag('posts', 'Gestion des articles')
    .addTag('anime', 'Recherche via Jikan API')
    .addTag('upload', 'Upload d\'images vers Cloudinary')
    .addBearerAuth()  // Active le bouton "Authorize" dans Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 AniNoren Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger UI available at http://localhost:${port}/api`);
}
bootstrap();
