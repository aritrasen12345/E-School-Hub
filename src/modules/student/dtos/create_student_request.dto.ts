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

export class CreateStudentRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student name!',
    example: 'test student name',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student parentName!',
    example: 'test student parentName',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  parentName: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student gender!',
    example: 'test student gender',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  gender: string; //! TODO USE ENUM HERE

  @ApiProperty({
    type: Number,
    required: true,
    description: 'Provide student standard!',
    example: 5,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(12)
  standard: number;

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
    description: 'Provide student mobileNo!',
    example: 'test student mobileNo',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  mobileNo: string; //! TODO ADD LENGTH VALIDATION

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student address!',
    example: 'test student address',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student bloodGroup!',
    example: 'test student bloodGroup',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  bloodGroup: string; //! TODO USE ENUM HERE

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
    description: 'Provide student schoolId!',
    example: '6687a4a0269f9762fe0c5e69',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'No school ID was passed!' })
  @IsMongoId()
  schoolId: string;
}
