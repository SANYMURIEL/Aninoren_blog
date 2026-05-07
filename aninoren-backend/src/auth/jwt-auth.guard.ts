import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Ce guard s'utilise avec @UseGuards(JwtAuthGuard) sur les routes protégées
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
