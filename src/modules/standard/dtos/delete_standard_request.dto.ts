import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DeleteStandardRequestDto {
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
    example: '65f1949c663d830ca74c5364',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  standard_id: string;
}
