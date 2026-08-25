import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'john@example.com', description: 'User valid email address' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
