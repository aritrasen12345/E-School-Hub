import { ApiResponseProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiResponseProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhOTZmMzNlLWY2NzktNGExOC04OGIwLTZkODkyY2NhNThlOSIsInVzZXJfcm9sZV9jb2RlIjoiViIsImlhdCI6MTcxNjkxMTA3MywiZXhwIjoxNzE2OTk3NDczfQ.UyJK6RyesamU-bXjhGknWXWPOvtDN3bvUoDlnXzEMtE',
  })
  readonly access_token: string;
  @ApiResponseProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODdhNGEwMjY5Zjk3NjJmZTBjNWU2OSIsImlhdCI6MTcyMDM1NTYzOCwiZXhwIjoxNzIyOTQ3NjM4fQ.VwPvrukrUTZ2RN0qWuJyTZeLApRWmUI10SAs2NPo-BE',
  })
  readonly refresh_token: string;
}
