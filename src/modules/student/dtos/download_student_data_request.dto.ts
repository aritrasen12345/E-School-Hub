import { ApiProperty } from '@nestjs/swagger';
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
