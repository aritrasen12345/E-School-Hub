// * PACKAGE IMPORTS
import {
  BadRequestException,
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
import { getForgetPasswordEmailTemplate } from 'src/common/assets/email_template.asset';
import { MailService } from '../mail/mail.service';
import { ResetPasswordRequestDto } from './dtos';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    private readonly authHelper: AuthHelper,
    @Inject('ACCESS_JWT') private readonly accessJwtService: JwtService,
    @Inject('FORGET_PASSWORD_JWT')
    private readonly forgetPasswordJwtService: JwtService,
    private readonly authUtil: AuthUtil,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
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

  // * SEND PASSWORD RESET EMAIL
  async sendPasswordResetEmail(email: string) {
    this.logger.debug('Inside sendPasswordResetEmail!');

    // * FIND VERIFIED SCHOOL
    const foundSchool = await this.schoolModel.findOne({
      email,
      isVerified: true,
    });

    // * IF UNABLE TO FIND VERIFIED SCHOOL
    if (!foundSchool) {
      throw new NotFoundException('No school found with this email!');
    }

    /**
     * IF THE SCHOOL IS PRESENT THEN WE WILL GENERATE A LINK WITH THE HELP OF schoolId and JWT TOKEN WHICH WILL BE SENT TO THE SCHOOL'S EMAIl.
     */
    const token = await this.forgetPasswordJwtService.signAsync({
      id: foundSchool?._id,
    });

    // * ADD THE VERIFY_TOKEN IN SCHOOL TOKEN
    foundSchool.verifyToken = token;
    const setSchoolToken = await foundSchool.save();

    // * IF UNABLE TO ADD TOKEN
    if (!setSchoolToken) {
      throw new BadRequestException(`Can't add token!`);
    }

    // * SET THE FORGET_PASSWORD EMAIL TEMPLATE
    const template = getForgetPasswordEmailTemplate(
      foundSchool.schoolName,
      token,
    );

    // * SEND EMAIL
    const sendEmailResult = await this.mailService.sendEmail(
      foundSchool.email,
      'Reset Password Link',
      template,
    );

    // * IF UNABLE TO SEND EMAIL
    if (!sendEmailResult) {
      throw new BadRequestException(`Can not send email, try after some time!`);
    }

    return sendEmailResult;
  }

  // * METHOD FOR RESET PASSWORD
  async resetPassword(body: ResetPasswordRequestDto): Promise<SchoolDocument> {
    this.logger.debug('Inside resetPassword!');

    const { token, newPassword, confirmPassword } = body;

    // * VERIFY RESET PASSWORD JWT
    const schoolId = await this.authUtil.verifyResetPasswordJWT(token);

    // * FIND SCHOOL WITH VERIFIED TOKEN
    const foundSchool = await this.schoolModel.findOne({
      _id: schoolId,
      verifyToken: token,
    });

    // * IF SCHOOL NOT FOUND
    if (!foundSchool) {
      throw new BadRequestException(
        `Either incorrect email or the link is invalid`,
      );
    }

    // * VERIFY FORGET_PASSWORD
    const verifyToken = await this.forgetPasswordJwtService.verifyAsync(token, {
      secret: this.configService.get<string>('FORGET_PASSWORD_SECRET_KEY'),
    });

    if (!verifyToken) {
      throw new UnauthorizedException('Invalid token!');
    }

    // * IF PASSWORD AND CONFIRM_PASSWORD NOT SAME
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        `This new password doesn't match with confirm password`,
      );
    }

    // * HASH THE NEW PASSWORD
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // * ADD THE NEW PASSWORD INTO DOCUMENT
    foundSchool.password = hashedNewPassword;
    foundSchool.verifyToken = '';

    // * UPDATE THE SCHOOL DOCUMENT
    const updatedSchool = await foundSchool.save();

    /**
     * IF THE SCHOOL IS UPDATED SUCCESSFULLY THEN RESOLVING WITH THE CREATED DOC, OTHERWISE REJECTING THE PROMISE
     */
    if (!updatedSchool) {
      throw new BadRequestException(
        'Cannot update school. Something went wrong!',
      );
    }

    return updatedSchool;
  }
}
