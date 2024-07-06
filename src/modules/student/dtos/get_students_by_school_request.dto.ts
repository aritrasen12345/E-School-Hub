import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetStudentsBySchoolRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student schoolId!',
    example: '6687a4a0269f9762fe0c5e69',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'No school ID was passed!' })
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
