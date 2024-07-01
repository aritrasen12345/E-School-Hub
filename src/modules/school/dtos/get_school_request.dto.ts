import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GetSchoolRequestDto {
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
}
