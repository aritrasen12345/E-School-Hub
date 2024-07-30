import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class GetStandardsListRequestDto {
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
