import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentRequestDto } from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from 'src/common/schemas';
import { Model } from 'mongoose';
import { SchoolService } from '../school/school.service';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly schoolService: SchoolService,
  ) {}

  async createStudent(body: CreateStudentRequestDto) {
    this.logger.debug('Inside createStudent!');

    const {
      name,
      parentName,
      standard,
      section,
      gender,
      roll,
      mobileNo,
      address,
      bloodGroup,
      schoolId,
    } = body;

    // * CHECK WHETHER SCHOOL FOUND
    const existingSchool = await this.schoolService.getSchoolById(schoolId);

    // * IF SCHOOL NOT FOUND
    if (!existingSchool) {
      throw new NotFoundException('School not found!');
    }

    /**
     * IF ANOTHER STUDENT IS PRESENT IN THE SAME STANDARD SAME SECTION WITH SAME ROLL NO
     */
    const isStudentFound = await this.studentModel.findOne({
      standard,
      section,
      roll,
      schoolId,
    });

    // * CHECK IF THE STUDENT IS ALREADY PRESENT OR NOT
    // * REJECT PROMISE IF FOUND DUPLICATION
    if (isStudentFound) {
      throw new NotFoundException('This student is already been admitted!');
    }

    // * CREATE NEW STUDENT
    const newStudent = new this.studentModel({
      name,
      parentName,
      gender,
      standard,
      section,
      roll,
      mobileNo,
      address,
      bloodGroup,
      schoolId,
    });

    const createdStudent = await newStudent.save();

    // * IF UNABLE TO CREATE A NEW STUDENT THROW ERROR
    if (!createdStudent) {
      throw new BadRequestException('Error while creating new student!');
    }

    // * RETURN THE NEW STUDENT
    return createdStudent;
  }
}
