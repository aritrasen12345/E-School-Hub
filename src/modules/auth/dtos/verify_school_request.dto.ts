import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class VerifySchoolRequestDto {
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
}
