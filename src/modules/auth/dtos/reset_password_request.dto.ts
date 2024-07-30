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
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODdhNGEwMjY5Zjk3NjJmZTBjNWU2OSIsImlhdCI6MTcyMDM1NTYzOCwiZXhwIjoxNzIyOTQ3NjM4fQ.VwPvrukrUTZ2RN0qWuJyTZeLApRWmUI10SAs2NPo-BE',
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
    description: 'School password!',
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
    description: 'School password!',
    example: 'Test@12345',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  confirmPassword: string;
}
