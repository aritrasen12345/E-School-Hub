import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshAccessTokenRequestDto,
} from './dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  // * LOGIN API
  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Login User!',
    operationId: 'login',
  })
  @ApiOkResponse({
    description: 'Successfully logged in user!',
    type: LoginResponseDto,
  })
  async login(
    @Req() req,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() body: LoginRequestDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug('Inside login!');
    const { accessToken, refreshToken } = await this.authService.generateToken(
      req.school.id,
      req.ip,
    );

    return { accessToken, refreshToken };
  }

  // * REFRESH ACCESS TOKEN
  @Post('/refresh_access_token')
  @ApiOperation({
    summary: 'Refresh access token!',
    operationId: 'refreshAccessToken',
  })
  @ApiOkResponse({
    description: 'Access token generated successfully!',
    type: String,
  })
  async refreshAccessToken(
    @Req() req,
    @Body() body: RefreshAccessTokenRequestDto,
  ): Promise<string> {
    this.logger.debug('Inside refreshAccessToken!');

    const { refreshToken } = body;

    // * REFRESH ACCESS TOKEN
    const { accessToken } = await this.authService.refreshAccessToken(
      refreshToken,
      req.ip,
    );

    return accessToken;
  }

  // * DELETE REFRESH TOKEN
  @Post('/delete_refresh_token')
  @ApiOperation({
    summary: 'Delete refresh token!',
    operationId: 'deleteRefreshToken',
  })
  @ApiOkResponse({
    description: 'Refresh token deleted successfully!',
    // type: String, // TODO
  })
  async deleteRefreshToken(
    @Req() req,
    @Body() body: RefreshAccessTokenRequestDto,
  ) {
    this.logger.debug('Inside deleteRefreshToken!');

    const { refreshToken } = body;

    const { isSuccessful } = await this.authService.deleteRefreshToken(
      refreshToken,
      req.ip,
    );

    return {
      message: isSuccessful
        ? 'Refresh token deleted successfully!'
        : 'Unable to delete refresh token!',
      data: {},
    };
  }
}
