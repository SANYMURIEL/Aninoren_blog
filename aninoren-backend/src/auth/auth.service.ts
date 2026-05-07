import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const adminEmail = this.configService.getOrThrow<string>('ADMIN_EMAIL');
    const adminPassword = this.configService.getOrThrow<string>('ADMIN_PASSWORD');

    // Vérifier l'email
    if (loginDto.email !== adminEmail) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Vérifier le mot de passe (supporte bcrypt hash ou texte brut)
    let passwordValid: boolean;
    if (adminPassword.startsWith('$2b$')) {
      passwordValid = await bcrypt.compare(loginDto.password, adminPassword);
    } else {
      passwordValid = loginDto.password === adminPassword;
    }

    if (!passwordValid) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    // Générer le JWT
    const payload = { sub: 'admin', email: adminEmail, role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
