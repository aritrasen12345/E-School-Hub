import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SchoolDocument } from 'src/common/types';
import {
  ChangePasswordRequestDto,
  CreateSchoolRequestDto,
  DeleteSchoolRequestDto,
  GetSchoolRequestDto,
  UpdateSchoolRequestDto,
} from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { School } from 'src/common/schemas';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { createSchoolTemplate } from 'src/common/assets/email_template.asset';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchoolService {
  private readonly logger = new Logger(SchoolService.name);

  constructor(
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
    @Inject('CREATED_SCHOOL_JWT')
    private readonly createSchoolJwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // * METHOD TO CREATE A NEW SCHOOL
  async createNewSchool(body: CreateSchoolRequestDto): Promise<SchoolDocument> {
    this.logger.debug('Inside createNewSchool!');

    const { password, confirmPassword, schoolName, email } = body;

    // * COMPARE PASSWORD AND CONFIRM_PASSWORD
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords are different!');
    }

    // * CHECK WHETHER AN ANOTHER SCHOOL IS PRESENT WITH SAME EMAIL
    const isSchoolFound = await this.schoolModel.findOne({
      email,
      isVerified: true,
    });

    if (isSchoolFound) {
      throw new NotFoundException(
        'This email is already used by some other school!',
      );
    }

    // * IF THE SCHOOL IS NOT PRESENT THEN HASHING THE PASSWORD AND CREATING A NEW SCHOOL RECORD WITH isVerified === false
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // * CREATE A NEW SCHOOL INSTANCE
    const newSchool = new this.schoolModel({
      password: hashedPassword,
      schoolName,
      email,
    });

    // * SAVE THE NEW SCHOOL IN DB
    const createdSchool = await newSchool.save();

    // * THROW EXCEPTION IF UNABLE TO CREATE THE NEW SCHOOL
    if (!createdSchool) {
      throw new BadRequestException(
        'Cannot create school. Something went wrong!',
      );
    }

    // * WE WILL GENERATE A LINK WITH THE HELP OF schoolId AND JWT TOKEN WHICH WILL BE SENT TO THE SCHOOL'S EMAIL.
    const token = await this.createSchoolJwtService.signAsync({
      id: createdSchool._id,
    });

    // * ADD THE TOKEN INTO THE DOCUMENT
    createdSchool.verifyToken = token;

    // * SAVE THE UPDATED DOCUMENT
    const setSchoolToken = await createdSchool.save();

    // * IF UNABLE TO ADD TOKEN
    if (!setSchoolToken) {
      throw new BadRequestException('Unable to add token!');
    }

    // * GENERATE THE EMAil TEMPLATE
    const emailTemplate = createSchoolTemplate(createdSchool.schoolName, token);

    // * SEND EMAIL VERIFICATION EMAIL
    const emailResult = await this.mailService.sendEmail(
      createdSchool.email,
      'Email Verification',
      emailTemplate,
    );

    // * IF UNABLE TO SEND EMAIL
    if (!emailResult) {
      throw new BadRequestException('Can not send email, try after some time!');
    }

    return createdSchool;
  }

  // * METHOD TO GET SCHOOL DETAILS
  async getSchool(body: GetSchoolRequestDto): Promise<SchoolDocument> {
    this.logger.debug('Inside getSchool!');

    const { email } = body;

    // * CHECKING IF THE SCHOOL IS AVAILABLE OR NOT
    const isSchoolFound = await this.schoolModel.findOne({ email });

    // * IF SCHOOL NOT FOUND
    if (!isSchoolFound) {
      throw new NotFoundException('This school is not found!');
    }

    // * IF SCHOOL FOUND
    return isSchoolFound;
  }

  // * METHOD TO UPDATE SCHOOL DETAILS
  async updateSchool(body: UpdateSchoolRequestDto): Promise<SchoolDocument> {
    this.logger.debug('Inside updateSchool!');

    const { schoolName, email } = body;

    // * FIND SCHOOL WITH EMAIL
    const foundSchool = await this.schoolModel.findOne({ email });

    // * IF SCHOOL NOT FOUND
    if (!foundSchool) {
      throw new NotFoundException('School not found!');
    }

    // * UPDATE ALL THE PAYLOAD VALUES
    foundSchool.email = email;
    foundSchool.schoolName = schoolName;

    // * SAVE THE UPDATED VALUES
    const setUpdated = await foundSchool.save();

    return setUpdated;
  }

  // * METHOD FOR CHANGE PASSWORD
  async changePassword(body: ChangePasswordRequestDto) {
    this.logger.debug('Inside changePassword!');
    const { schoolId, old_password, new_password, confirm_password } = body;

    // * FIND SCHOOL BY ID
    const foundSchool = await this.schoolModel.findById(schoolId);

    // * IF SCHOOL NOT FOUND OR DELETED THROW ERROR
    if (!foundSchool || foundSchool.isDeleted === true) {
      throw new NotFoundException('School not found or deleted!');
    }

    /**
     * IF THE SCHOOL IS PRESENT THEN HASHING THE PASSWORD AND MATCHING WITH THE DB'S PASSWORD
     */
    const isCorrectPassword = await bcrypt.compare(
      old_password,
      foundSchool.password,
    );

    // * IF PASSWORD IS WRONG
    if (!isCorrectPassword) {
      throw new UnauthorizedException(
        `This password doesn't match with previous password`,
      );
    }

    // * CHECK WHETHER NEW_PASSWORD AND CONFIRM_PASSWORD ARE SAME
    if (new_password !== confirm_password) {
      throw new BadRequestException(
        `This new password doesn't match with confirm password!`,
      );
    }

    // * HASH THE PASSWORD
    const salt = await bcrypt.genSalt();
    const hashedNewPassword = await bcrypt.hash(new_password, salt);

    // * SAVE THE NEW PASSWORD INTO DB
    foundSchool.password = hashedNewPassword;

    const updatedSchool = await foundSchool.save();

    // * IF NOT UPDATE PROPERLY THROW ERROR
    if (!updatedSchool) {
      throw new BadRequestException(
        `Cannot update school. Something went wrong!`,
      );
    }

    return updatedSchool;
  }

  // * METHOD FOR DELETE SCHOOL
  async deleteSchool(body: DeleteSchoolRequestDto) {
    this.logger.debug('Inside deleteSchool!');

    const { email, password } = body;

    // * FIND THE SCHOOL BY EMAIL
    const foundSchool = await this.schoolModel.findOne({ email });

    // * IF THE SCHOOL NOT FOUND OR DELETED
    if (!foundSchool || foundSchool.isDeleted === true) {
      throw new NotFoundException('This school is not found!');
    }

    /**
     * IF THE SCHOOL IS PRESENT THEN HASHING THE PASSWORD AND MATCHING WITH THE PASSWORD.
     */
    const isCorrectPassword = await bcrypt.compare(
      password,
      foundSchool.password,
    );

    // * IF THE PASSWORD DOESN'T MATCH
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect Password!');
    }

    // * SET isDeleted TO TRUE OF THE SCHOOL IF THE PASSWORD IS CORRECT
    foundSchool.isDeleted = true;

    // * SAVE THE MODIFIED SCHOOL
    const setIsDeleted = await foundSchool.save();

    // * RETURN THE UPDATED SCHOOL
    return setIsDeleted;
  }
}
