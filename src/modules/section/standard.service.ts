import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Standard } from 'src/common/schemas';
import { StandardDocument } from 'src/common/types';
import { Section } from './dtos';

@Injectable()
export class StandardService {
  private readonly logger = new Logger(StandardService.name);

  constructor(
    @InjectModel(Standard.name) private readonly standardModel: Model<Standard>,
  ) {}

  // * METHOD TO CREATE STANDARD
  async createStandard(
    schoolId: string,
    standard_name: string,
    sections: Section[],
  ): Promise<StandardDocument> {
    this.logger.debug('Inside createStandard!');

    // * CHECK WHETHER SAME STANDARD IS PRESENT FOR THE A SCHOOL
    const isStandardFound = await this.standardModel.find({
      schoolId,
      standard_name,
      isDeleted: false,
    });

    // * IF PRESENT THROW ERROR
    if (isStandardFound?.length) {
      throw new NotFoundException('Duplicate standard found!');
    }

    // * CREATE NEW STANDARD
    const newStandard = new this.standardModel({
      standard_name,
      schoolId,
      sections,
    });

    // * SAVE THE STANDARD
    const savedStandard = await newStandard.save();

    // * IF UNABLE TO SAVE THROW ERROR
    if (!savedStandard) {
      throw new BadRequestException(`Can't create new Standard!`);
    }

    // * SAVE STANDARD
    return savedStandard;
  }

  // * METHOD TO GET STANDARDS BY SCHOOL
  async getStandardBySchool(schoolId: string): Promise<StandardDocument[]> {
    this.logger.debug('Inside getStandardBySchool!');

    // * CHECK IF STANDARDS ARE THERE
    const isStandardFound = await this.standardModel.find({
      schoolId,
      isDeleted: false,
    });

    // * IF STANDARDS ARE AVAILABLE
    if (!isStandardFound) {
      throw new NotFoundException('No standards found!');
    }

    // * RETURN STANDARDS
    return isStandardFound;
  }
}
