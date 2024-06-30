import {
  Inject,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from 'src/common/schemas';

export class AuthHelper {
  private readonly logger = new Logger(AuthHelper.name);

  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @Inject('ACCESS_JWT') private readonly accessJwtService: JwtService,
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

  // * METHOD TO VALIDATE REFRESH TOKEN
  async validateRefreshToken(
    refreshToken: string,
    ipAddress: string,
  ): Promise<{ isValidated: boolean; schoolId: string }> {
    this.logger.debug('Inside validateRefreshToken!');

    /**
     * DECODING THE REFRESH TOKEN FIRST. IF THE REFRESH TOKEN IS VALID THEN
     * IT WILL CONTAIN THE schoolId INSIDE the {id} KEY
     * THE SYNTAX {id: schoolId} = .... JUST MEANS I AM DESTRUCTING AN OBJECT AND TAKING
     * THE {id} KEY AND RE-NAMING IT AS {schoolId}
     */
    const { id: schoolId } = await this.refreshJwtService.verify(refreshToken);

    // * FINDING THE REFRESH TOKEN IN THE DB
    const foundRefreshToken = await this.refreshTokenModel.findOne({
      token: refreshToken,
      // * THE schoolId should be the same the encrypted schoolId
      schoolId: schoolId,
      /**
       * THE REQUest TO REFRESH THE ACCESS TOKEN SHOULD COME FROM THE SAME IP ADDRESS
       * TO WHICH THIS REFRESH TOKEN WAS BEING ASSIGNED TO. HENCE MATCHING IP
       */
      ipAddress,
      // * WHEN THE USER LOGS OUT THEN THE REFRESH TOKEN WILL BE MARKED AS DELETED
      isDeleted: false,
    });

    /**
     * IF WE GET A REFRESH TOKEN IN THE DB WHICH FULFILLS ALL THE CONDITIONS
     * THAT MEANS THAT REFRESH TOKEN IS VALID AND WE SHOULD RETURN VALIDATED
     */

    if (!foundRefreshToken) {
      /**
       * YOU MIGHT THINK THAT STATUS SHOULD BE 'NOT FOUND' AND MESSAGE ACCORDING TO THAT BUT
       * PLEASE NOTE THE CLIENT SHOULD NOT KNOW THAT THE TOKEN IS IN-VALID.
       * THERE IS NO NEED TO EXPLORE THE INTERNAL IMPLEMENTATION OF OUR SECURITY SYSTEM.
       * IF THE REFRESH TOKEN IS NOT PRESENT IN THE DB THAT'S NOT OUR FAULT SO WE SHOULD NOT DISCLOSE THAT.
       */
      throw new UnauthorizedException(
        `Invalid refresh token. Can't create a access token!`,
      );
    }

    return {
      isValidated: true,
      schoolId,
    };
  }
}
