import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateSchoolRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'School Email!',
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
    description: 'School password!',
    example: 'Test@12345',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

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
  confirmPassword: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide school name!',
    example: 'test schoolName',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  schoolName: string;
}
