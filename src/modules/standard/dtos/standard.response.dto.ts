import { ApiResponseProperty } from '@nestjs/swagger';
import { SectionDocument } from 'src/common/types/section.type';

export class StandardResponseDto {
  @ApiResponseProperty({
    example: 1,
  })
  standard_name: string;

  @ApiResponseProperty({
    example: '6687a4a0269f9762fe0c5e69',
  })
  schoolId: string;

  @ApiResponseProperty({
    example: [
      {
        label: 'a',
        value: 'A',
      },
    ],
  })
  sections: SectionDocument[];

  @ApiResponseProperty()
  isDeleted: boolean;
}
