import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class UpdateStudentRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student standard!',
    example: 'test student standard',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  standard: string;

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
  @IsString()
  @IsNotEmpty()
  genderToUpdate: string; //! TODO USE ENUM HERE

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide student standardToUpdate!',
    example: 'test student standardToUpdate',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  standardToUpdate: string;

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
  @IsString()
  @IsNotEmpty()
  mobileNoToUpdate: string; //! TODO ADD LENGTH VALIDATION

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
