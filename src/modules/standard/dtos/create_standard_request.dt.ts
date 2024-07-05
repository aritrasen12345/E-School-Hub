import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Section } from './section.dto';

export class CreateStandardRequestDto {
  @ApiProperty({
    type: String,
    required: true,
    example: '65f1949c663d830ca74c5364',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty({ message: 'No school ID was passed!' })
  @IsMongoId()
  schoolId: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Provide standard name!',
    example: 'test standard name',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  standard_name: string;

  @ApiProperty({
    type: [Section],
    required: true,
    description: 'Provide section array!',
  })
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Section)
  sections: Section[];
}
