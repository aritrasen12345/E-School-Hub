import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiResponseProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhOTZmMzNlLWY2NzktNGExOC04OGIwLTZkODkyY2NhNThlOSIsInVzZXJfcm9sZV9jb2RlIjoiViIsImlhdCI6MTcxNjkxMTA3MywiZXhwIjoxNzE2OTk3NDczfQ.UyJK6RyesamU-bXjhGknWXWPOvtDN3bvUoDlnXzEMtE',
  })
  readonly access_token: string;

  // TODO school
  // @ApiResponseProperty({
  //   example: {

  //   }  //! TODO ADD USER RESPONSE
  // })
  // readonly school:
}
