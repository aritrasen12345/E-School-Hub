import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class DeleteSchoolRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User Email!',
    example: 'john@email.com',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User password!',
    example: 'Test@12345',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;
}
