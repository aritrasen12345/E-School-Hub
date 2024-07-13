import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class DownloadStudentDataRequestDto {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'provide limit',
    example: 10,
  })
  @IsDefined()
  @IsNumber()
  limit: number;

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
}
