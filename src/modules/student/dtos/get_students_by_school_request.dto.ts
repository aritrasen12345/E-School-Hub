import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetStudentsBySchoolRequestDto {
  @ApiPropertyOptional({
    type: String,
    required: false,
    example: '65f1949c663d830ca74c5364',
  })
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  schoolId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'provide page no',
    example: 1,
  })
  @IsDefined()
  @IsString()
  page: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'provide size',
    example: 10,
  })
  @IsDefined()
  @IsString()
  size: string;

  @ApiPropertyOptional({
    type: String,
    required: true,
    description: 'Provide search string!',
    example: 'Ram',
  })
  @IsOptional()
  @IsDefined()
  @IsString()
  searchString: string;
}
