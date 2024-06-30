import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ResetPasswordRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide token!',
    example: '', //! TODO PROVIDE EXAMPLE
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({
    message: 'No token attached!',
  })
  token: string;

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
  newPassword: string;

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
}
