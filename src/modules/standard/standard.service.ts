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
import {
  DeleteStandardRequestDto,
  Section,
  UpdateStandardRequestDto,
} from './dtos';

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

  // * METHOD TO UPDATE STANDARDS OF SCHOOL
  async updateStandard(
    body: UpdateStandardRequestDto,
  ): Promise<StandardDocument> {
    this.logger.debug('Inside updateStandard!');
    const { standard_id, standard_name, sections, schoolId } = body;

    // * CHECKING IF THE STANDARD IS AVAILABLE OR NOT
    const isStandardFound = await this.standardModel.findOne({
      schoolId,
      _id: standard_id,
    });

    // * IF STANDARD NOT FOUND
    if (!isStandardFound) {
      throw new NotFoundException('No standard found!');
    }

    // * UPDATE THE STANDARD'S PROPERTIES
    const setUpdated = await this.standardModel.findOneAndUpdate(
      { schoolId, _id: standard_id },
      { sections, standard_name },
      { new: true },
    );

    // * IF UNABLE TO UPDATE
    if (!setUpdated) {
      throw new BadRequestException('Unable to update standard!');
    }

    // * RETURN THE UPDATED SECTION
    return setUpdated;
  }

  // * METHOD TO DELETE STANDARD
  async deleteStandard(
    body: DeleteStandardRequestDto,
  ): Promise<StandardDocument> {
    this.logger.debug('Inside deleteStandard!');

    const { standard_id } = body;

    // * FIND STANDARD
    const foundStandard = await this.standardModel.findById(standard_id);

    // * IF STANDARD NOT FOUND THROW ERROR
    if (!foundStandard || foundStandard.isDeleted === true) {
      throw new NotFoundException('Standard not found!');
    }

    // * IF FOUND SET isDeleted = true
    foundStandard.isDeleted = true;

    // * SAVE THE MODIFIED STANDARD
    const setStandardDeleted = await foundStandard.save();

    // * RETURN THE STANDARD
    return setStandardDeleted;
  }
}
