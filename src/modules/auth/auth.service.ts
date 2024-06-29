import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from 'src/common/schemas';
import { AuthHelper } from './helpers/auth.helper';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    private readonly authHelper: AuthHelper,
  ) {}

  async login(
    email: string,
    password: string,
    ipAddress: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // * FIRST CHECKING WHETHER THE SCHOOL IS REGISTERED OR NOT
    const foundSchool = await this.schoolModel.findOne({
      email,
      isVerified: true,
    });

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

    // * GENERATE ACCESS_TOKEN AND REFRESH_TOKEN
    const { accessToken, refreshToken } = await this.authHelper.generateTokens(
      foundSchool.id,
      ipAddress,
    );

    // * IF EVERYTHING WAS SUCCESSFUL
    return { accessToken, refreshToken };
  }
}
