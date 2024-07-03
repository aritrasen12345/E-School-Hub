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
import { GetStudentsBySchoolRequestDto } from './dtos/get_students_by_school_request.dto';
import { StudentDocument } from 'src/common/types';
import { query } from 'express';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    private readonly schoolService: SchoolService,
  ) {}

  // * METHOD FOR CREATE STUDENT
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

  // * METHOD TO FETCH ALL STUDENTS
  async getStudents() {
    this.logger.debug('Inside getStudents!');

    // * CHECKING ALL THE STUDENTS FROM DB
    const foundStudents = await this.studentModel.find({});

    // * IF NO STUDENTS ARE FOUND THROW REJECT
    if (!foundStudents) {
      throw new NotFoundException('No student found!');
    }

    // * RETURN STUDENTS
    return foundStudents;
  }

  // * METHOD FOR GET STUDENTS BY SCHOOL
  async getStudentsBySchool(
    body: GetStudentsBySchoolRequestDto,
  ): Promise<{ studentList: StudentDocument[]; countStudents: number }> {
    this.logger.debug('Inside getStudentsBySchool!');

    // * GENERATE THE FIND QUERY
    const { schoolId, page = 1, size = 10, searchString = '' } = body;

    const limit = size;
    const skip = (page - 1) * size;

    const findQuery: any = {
      schoolId,
      isDeleted: false,
    };

    if (searchString) {
      findQuery.$or = [
        { name: { $regex: searchString, $options: 'i' } },
        { parentName: { $regex: searchString, $options: 'i' } },
        { gender: { $regex: searchString, $options: 'i' } },
        { standard: { $regex: searchString, $options: 'i' } },
        { section: { $regex: searchString, $options: 'i' } },
        { roll: { $regex: searchString, $options: 'i' } },
        { mobileNo: { $regex: searchString, $options: 'i' } },
        { address: { $regex: searchString, $options: 'i' } },
        { bloodGroup: { $regex: searchString, $options: 'i' } },
      ];
    }

    // FIND STUDENTS
    const foundStudents = await this.studentModel
      .find(findQuery)
      .limit(limit)
      .skip(skip);

    // * COUNT STUDENTS NUMBER
    const countStudents = await this.studentModel.countDocuments(findQuery);

    return { studentList: foundStudents, countStudents };
  }
}
