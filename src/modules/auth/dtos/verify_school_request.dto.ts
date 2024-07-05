import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class VerifySchoolRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide token!',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODc5ZTA2MTdlMjZmMjUxOWQ0MTMxMCIsImlhdCI6MTcyMDE2Mzg0NiwiZXhwIjoxNzIwMjUwMjQ2fQ.IVK1Z0LIx7XXBUJh4eVLd0RMNBn1k9JVLLVAAovYAlw',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({
    message: 'No token attached!',
  })
  token: string;
}
