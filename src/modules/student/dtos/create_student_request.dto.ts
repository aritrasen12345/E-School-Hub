import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { GENDER } from 'src/common/enums';

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
  @IsEnum(GENDER)
  @IsString()
  @IsNotEmpty()
  gender: GENDER;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student standard!',
    example: '1',
  })
  @IsDefined()
  @IsString()
  standard: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student roll!',
    example: '1',
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
  @Length(10)
  @IsString()
  @IsNotEmpty()
  mobileNo: string;

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
