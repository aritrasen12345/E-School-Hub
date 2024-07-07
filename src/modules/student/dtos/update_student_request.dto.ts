import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { GENDER } from 'src/common/enums';

export class UpdateStudentRequestDto {
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
    example: '6687a4a0269f9762fe0c5e69',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'No school ID was passed!' })
  @IsMongoId()
  schoolId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student nameToUpdate!',
    example: 'test student nameToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  nameToUpdate: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student parentNameToUpdate!',
    example: 'test student parentNameToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  parentNameToUpdate: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student genderToUpdate!',
    example: 'test student genderToUpdate',
  })
  @IsDefined()
  @IsEnum(GENDER)
  @IsString()
  @IsNotEmpty()
  genderToUpdate: GENDER;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student standardToUpdate!',
    example: 12,
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  @Max(12)
  standardToUpdate: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student rollToUpdate!',
    example: 'test student rollToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  rollToUpdate: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student mobileNoToUpdate!',
    example: 'test student mobileNoToUpdate',
  })
  @IsDefined()
  @Length(10)
  @IsString()
  @IsNotEmpty()
  mobileNoToUpdate: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student addressToUpdate!',
    example: 'test student addressToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  addressToUpdate: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student bloodGroupToUpdate!',
    example: 'test student bloodGroupToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  bloodGroupToUpdate: string; //! TODO USE ENUM HERE

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student sectionToUpdate!',
    example: 'test student sectionToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  sectionToUpdate: string;
}
