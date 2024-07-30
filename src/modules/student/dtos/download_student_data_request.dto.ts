import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DownloadStudentDataRequestDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'provide limit',
    example: 1000,
  })
  @IsDefined()
  @IsString()
  limit: string;

  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '65f1949c663d830ca74c5364',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  schoolId: string;
}
