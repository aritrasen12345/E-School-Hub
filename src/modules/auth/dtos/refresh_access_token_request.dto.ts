import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide refreshToken!',
    example: '',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({
    message: 'No refresh token attached!',
  })
  refreshToken: string;
}
