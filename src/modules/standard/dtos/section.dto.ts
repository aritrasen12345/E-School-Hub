import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class Section {
  @ApiProperty({
    type: String,
    required: true,
    example: 'A',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'a',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  value: string;
}
