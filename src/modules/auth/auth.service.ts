// * PACKAGE IMPORTS
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// * LOCAL IMPORTS
import { RefreshToken, School } from 'src/common/schemas';
import { AuthHelper } from './helpers/auth.helper';
import { SchoolDocument } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';
import { AuthUtil } from './util/auth.util';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly authHelper: AuthHelper,
    @Inject('ACCESS_JWT') private readonly accessJwtService: JwtService,
    private readonly authUtil: AuthUtil,
  ) {}

  // * METHOD FOR GENERATING ACCESS AND REFRESH TOKENS
  async generateToken(
    schoolId: string,
    ipAddress: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // * GENERATE ACCESS_TOKEN AND REFRESH_TOKEN
    const { accessToken, refreshToken } = await this.authHelper.generateTokens(
      schoolId,
      ipAddress,
    );

    // * IF EVERYTHING WAS SUCCESSFUL
    return { accessToken, refreshToken };
  }

  // * METHOD FOR VALIDATING SCHOOL LOGIN CREDENTIALS
  async validateSchoolCredentials(
    email: string,
    password: string,
  ): Promise<SchoolDocument> {
    this.logger.debug('Inside validateSchoolCredentials!');

    // * FIRST CHECKING WHETHER THE SCHOOL IS REGISTERED OR NOT
    const foundSchool = await this.schoolModel.findOne({
      email,
      isVerified: true,
    });

    // * IF SCHOOL IS NOT FOUND
    if (!foundSchool) {
      throw new NotFoundException('No school found with the given email!');
    }

    // * CHECK WHETHER THE SCHOOL IS VERIFIED OR NOT
    if (!foundSchool.isVerified) {
      throw new UnauthorizedException('Please verify your email to login!');
    }

    // * COMPARING PASSWORD
    const isPasswordMatched = await bcrypt.compare(
      password,
      foundSchool.password,
    );

    // * IF THE PASSWORD IS WRONG
    if (!isPasswordMatched) {
      throw new UnauthorizedException(
        'Incorrect password. Please provide the correct password!',
      );
    }

    // * IF EVERYTHING WAS SUCCESSFUL
    return foundSchool;
  }

  // * METHOD FOR REFRESHING ACCESS TOKEN
  async refreshAccessToken(
    refreshToken: string,
    ipAddress: string,
  ): Promise<{ accessToken: string }> {
    this.logger.debug('Inside refreshAccessToken!');

    // * VALIDATING THE REFRESH TOKEN
    const { isValidated, schoolId } =
      await this.authHelper.validateRefreshToken(refreshToken, ipAddress);

    if (!isValidated) {
      throw new UnauthorizedException(
        `Invalid refresh token. Can't create a access token.`,
      );
    }

    // * IF THE REFRESH TOKEN IS VALIDATED SUCCESSFULLY THEN CREATING A NEW TOKEN
    const accessToken = await this.accessJwtService.signAsync({
      id: schoolId,
    });

    return { accessToken };
  }

  // * METHOD TO DELETE REFRESH TOKEN
  async deleteRefreshToken(
    refreshToken: string,
    ipAddress: string,
  ): Promise<{ isSuccessful: boolean }> {
    this.logger.debug('Inside deleteRefreshToken!');

    // * FINDING THE REFRESH TOKEN
    const foundToken = await this.refreshTokenModel.findOne({
      token: refreshToken,
      ipAddress,
    });

    // * IF REFRESH TOKEN IS NOT FOUND
    if (!foundToken) {
      throw new UnauthorizedException(`Invalid refresh token. Can't delete!`);
    }

    // * IF FOUND THEN MARKING THE TOKEN AS DELETED
    foundToken.isDeleted = true;

    // * UPDATE THE TOKEN IN DB
    await foundToken.save();

    return { isSuccessful: true };
  }

  // * METHOD TO VERIFY SCHOOL
  async verifySchool(token: string): Promise<SchoolDocument> {
    this.logger.debug('Inside verifySchool!');

    // * VERIFY THE TOKEN
    const schoolId = await this.authUtil.verifySchoolJWT(token);

    // * FIND UNVERIFIED SCHOOL USING TOKEN AND ID
    const foundSchool = await this.schoolModel.findOne({
      _id: schoolId,
      verifyToken: token,
      isVerified: false,
    });

    if (!foundSchool) {
      throw new NotFoundException(
        'Either incorrect email or the link is invalid',
      );
    }

    /**
     * IF THE SCHOOL IS FOUND THEN VERIFYING THE SCHOOL
     * SETTING THE TOKEN TO EMPTY FOR ONE TIME USE
     */
    foundSchool.isVerified = true;
    foundSchool.verifyToken = '';

    // * UPDATE THE SCHOOL IN DB
    const updatedSchool = await foundSchool.save();

    // * IF THE SCHOOL NOT UPDATED PROPERLY
    if (!updatedSchool) {
      throw new UnauthorizedException(
        'Cannot update school. Something went wrong!',
      );
    }

    return updatedSchool;
  }
}
