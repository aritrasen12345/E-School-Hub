import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/common/schemas';

export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @Inject('ACCESS_TOKEN') private readonly accessJwtService: JwtService,
    @Inject('REFRESH_JWT') private readonly refreshJwtService: JwtService,
  ) {}

  async generateTokens(
    schoolId: string,
    ipAddress: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    this.logger.debug('Inside generateTokens!');

    // * GENERATE THE ACCESS TOKEN
    const accessToken = await this.accessJwtService.signAsync({ id: schoolId });

    // * GENERATE THE REFRESH TOKEN
    const refreshToken = await this.refreshJwtService.signAsync({
      id: schoolId,
    });

    // * SAVE THE REFRESH_TOKEN IN THE DB
    const newRefreshToken = new this.refreshTokenModel({
      token: refreshToken,
      schoolId,
      ipAddress,
    });

    const saveRefreshToken = await newRefreshToken.save();

    // * IF THE REFRESH TOKEN WAS NOT SAVED PROPERLY
    if (!saveRefreshToken) {
      throw new NotFoundException('No school found with the given email!');
    }

    // * RETURN ACCESS_TOKEN AND REFRESH_TOKEN
    return { accessToken, refreshToken };
  }
}
