import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchoolRequestDto {
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
    description: 'Provide username!',
    example: 'test school username',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  username: string;

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
