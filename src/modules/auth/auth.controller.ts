import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshAccessTokenRequestDto,
  ResetPasswordRequestDto,
  SendEmailRequestDto,
  VerifySchoolRequestDto,
} from './dtos';
import { SchoolDocument } from 'src/common/types';
import { ApiResponse } from 'src/common/interfaces';

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
  ): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> {
    this.logger.debug('Inside login!');
    const { accessToken, refreshToken } = await this.authService.generateToken(
      req.school.id,
      req.ip,
    );

    return {
      message: 'Successfully logged in user!',
      data: { accessToken, refreshToken },
    };
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
  ): Promise<ApiResponse<string>> {
    this.logger.debug('Inside refreshAccessToken!');

    const { refreshToken } = body;

    // * REFRESH ACCESS TOKEN
    const { accessToken } = await this.authService.refreshAccessToken(
      refreshToken,
      req.ip,
    );

    return {
      message: 'Access token generated successfully!',
      data: accessToken,
    };
  }

  // * DELETE REFRESH TOKEN
  @Post('/delete_refresh_token')
  @ApiOperation({
    summary: 'Delete refresh token!',
    operationId: 'deleteRefreshToken',
  })
  @ApiOkResponse({
    description: 'Refresh token deleted successfully!',
    // type: String, //! TODO DEFINE TYPE
  })
  //! TODO DEFINE RETURN TYPE
  //! DEFINE TYPE FOR req
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

  // * VERIFY SCHOOL
  @Post('verify_school')
  @ApiOperation({
    summary: 'Verify organization!',
    operationId: 'verifySchool',
  })
  @ApiOkResponse({
    description: 'Organisation verified successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async verifySchool(
    @Body() body: VerifySchoolRequestDto,
  ): Promise<ApiResponse<SchoolDocument>> {
    this.logger.debug('Inside verifySchool!');

    const { token } = body;

    const verifySchoolDetails = await this.authService.verifySchool(token);

    return {
      message: 'Organisation verified successfully!',
      data: verifySchoolDetails,
    };
  }

  // * FORGET PASSWORD SEND EMAIL
  @Post('/send_email')
  @ApiOperation({
    summary: 'send forget password email!',
    operationId: 'sendEmail',
  })
  @ApiOkResponse({
    description:
      'A password reset link has been sent to your registered email Id.',
    // type: //! TODO DEFINE TYPE
  })
  async forgetPassword(
    @Body() body: SendEmailRequestDto,
  ): Promise<ApiResponse<any>> {
    this.logger.debug('Inside forgetPassword!');

    const { email } = body;

    const savedEmailDetails =
      await this.authService.sendPasswordResetEmail(email);

    return {
      message:
        'A password reset link has been sent to your registered email Id.',
      data: savedEmailDetails,
    };
  }

  // * RESET PASSWORD SEND EMAIL
  @Post('/reset_password')
  @ApiOperation({
    summary: 'Reset password!',
    operationId: 'resetPassword',
  })
  @ApiOkResponse({
    description: 'Password updated successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async resetPassword(
    @Body() body: ResetPasswordRequestDto,
  ): Promise<ApiResponse<SchoolDocument>> {
    this.logger.debug('Inside resetPassword!');

    const resetPasswordDetails = await this.authService.resetPassword(body);

    return {
      message: 'Password updated successfully',
      data: resetPasswordDetails,
    };
  }
}
