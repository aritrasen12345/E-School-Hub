import { Body, Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dtos';

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
    @Body() body: LoginRequestDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug('Inside login!');
    const { accessToken, refreshToken } = await this.authService.generateToken(
      req.school.id,
      req.ip,
    );

    return { accessToken, refreshToken };
  }
}
