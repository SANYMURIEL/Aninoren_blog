import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@aninoren.com' })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({ example: 'ChangeThisPassword123!' })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe ne peut pas être vide' })
  password: string;
}
