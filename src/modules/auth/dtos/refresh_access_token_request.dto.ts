import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide refreshToken!',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODdhNGEwMjY5Zjk3NjJmZTBjNWU2OSIsImlhdCI6MTcyMDM1NTYzOCwiZXhwIjoxNzIyOTQ3NjM4fQ.VwPvrukrUTZ2RN0qWuJyTZeLApRWmUI10SAs2NPo-BE',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({
    message: 'No refresh token attached!',
  })
  refreshToken: string;
}
