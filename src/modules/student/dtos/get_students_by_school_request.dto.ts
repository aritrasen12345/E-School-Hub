import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  // IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetStudentsBySchoolRequestDto {
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

  @ApiProperty({
    type: Number,
    required: true,
    description: 'provide page no',
    example: 1,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'provide size',
    example: 10,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  size: number;

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
