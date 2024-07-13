import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class DeleteStandardRequestDto {
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
