import { ApiResponseProperty } from '@nestjs/swagger';
import { MongoBaseResponseDto } from 'src/common/dtos';

export class SchoolResponseDto extends MongoBaseResponseDto {
  @ApiResponseProperty({
    example: 'john@email.com',
  })
  email: string;

  @ApiResponseProperty({
    example: 'Test School',
  })
  schoolName: string;

  @ApiResponseProperty()
  isDeleted: boolean;

  @ApiResponseProperty()
  isVerified: boolean;

  @ApiResponseProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODc5ZTA2MTdlMjZmMjUxOWQ0MTMxMCIsImlhdCI6MTcyMDE2Mzg0NiwiZXhwIjoxNzIwMjUwMjQ2fQ.IVK1Z0LIx7XXBUJh4eVLd0RMNBn1k9JVLLVAAovYAlw',
  })
  verifyToken: string;
}
