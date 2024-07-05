import { ApiResponseProperty } from '@nestjs/swagger';

export class MongoBaseResponseDto {
  @ApiResponseProperty({
    example: '66879e0617e26f2519d41310',
  })
  _id: string;

  @ApiResponseProperty({
    example: '66879e0617e26f2519d41310',
  })
  createdAt: Date;
  @ApiResponseProperty({
    example: '66879e0617e26f2519d41310',
  })
  updatedAt: Date;
}
