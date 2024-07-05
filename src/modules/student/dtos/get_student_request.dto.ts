import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class GetStudentRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student standard!',
    example: 'test student standard',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(12)
  standard: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student section!',
    example: 'test student section',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student roll!',
    example: 'test student roll',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  roll: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student schoolId!',
    example: 'test student schoolId',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'No school ID was passed!' })
  @IsMongoId()
  schoolId: string;
}
