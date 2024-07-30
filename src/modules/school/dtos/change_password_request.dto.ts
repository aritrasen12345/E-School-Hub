import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class ChangePasswordRequestDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '65f1949c663d830ca74c5364',
  })
  // @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  schoolId: string;

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
  old_password: string;

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
  new_password: string;

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
  confirm_password: string;
}
