import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name (min 3 chars)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User valid email address' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (min 8 chars, 1 letter, 1 number, 1 special char)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  password!: string;
}
