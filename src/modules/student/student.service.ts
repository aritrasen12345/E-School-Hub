import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateStudentRequestDto,
  DeleteStudentRequestDto,
  DownloadStudentDataRequestDto,
  GetStudentRequestDto,
  GetStudentsBySchoolRequestDto,
  UpdateStudentRequestDto,
} from './dtos';
import { InjectModel } from '@nestjs/mongoose';
import { School, Student } from 'src/common/schemas';
import { Model } from 'mongoose';
import { SchoolService } from '../school/school.service';
import { StudentDocument } from 'src/common/types';
import { parse } from 'json2csv';

const json2csv = parse;

const CSV_FIELDS = [
  'name',
  'parentName',
  'gender',
  'standard',
  'roll',
  'mobileNo',
  'address',
  'bloodGroup',
];

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
    @InjectModel(School.name) private readonly schoolModel: Model<School>,
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

  // * METHOD TO GET STUDENT
  async getStudent(body: GetStudentRequestDto): Promise<StudentDocument> {
    this.logger.debug('Inside getStudent!');

    const { standard, section, roll, schoolId } = body;

    // * CHECKING A SINGLE STUDENT FROM DB
    const foundStudent = await this.studentModel.findOne({
      schoolId,
      standard,
      section,
      roll,
    });

    // * IF STUDENT NOT FOUND
    if (!foundStudent) {
      throw new NotFoundException('No student found!');
    }

    return foundStudent;
  }

  // * METHOD TO UPDATE STUDENT
  async updateStudent(body: UpdateStudentRequestDto): Promise<StudentDocument> {
    this.logger.debug('Inside updateStudent!');

    const {
      standard,
      section,
      roll,
      schoolId,
      nameToUpdate,
      parentNameToUpdate,
      standardToUpdate,
      sectionToUpdate,
      rollToUpdate,
      mobileNoToUpdate,
      addressToUpdate,
      bloodGroupToUpdate,
      genderToUpdate,
    } = body;

    // * CHECKING A SINGLE STUDENT THAT WILL BE UPDATED
    const foundStudent = await this.studentModel.findOne({
      schoolId,
      standard,
      section,
      roll,
    });

    // * IF NO STUDENT FOUND
    if (!foundStudent) {
      throw new NotFoundException('No student found!');
    }

    // * CHECK IF THERE IS ANY STUDENT WITH THE UPDATED VALUE
    const isDuplicateStudent = await this.studentModel.findOne({
      name: nameToUpdate,
      parentName: parentNameToUpdate,
      standard: standardToUpdate,
      section: sectionToUpdate,
      roll: rollToUpdate,
      mobileNo: mobileNoToUpdate,
      address: addressToUpdate,
      bloodGroup: bloodGroupToUpdate,
      gender: genderToUpdate,
      schoolId,
    });

    if (isDuplicateStudent) {
      throw new NotFoundException('This student is already been admitted!');
    }

    // * UPDATE THE STUDENT'S PROPERTIES
    foundStudent.name = nameToUpdate;
    foundStudent.parentName = parentNameToUpdate;
    foundStudent.standard = standardToUpdate;
    foundStudent.section = sectionToUpdate;
    foundStudent.roll = rollToUpdate;
    foundStudent.mobileNo = mobileNoToUpdate;
    foundStudent.address = addressToUpdate;
    foundStudent.bloodGroup = bloodGroupToUpdate;
    foundStudent.gender = genderToUpdate;

    // * SAVE THE UPDATED STUDENT
    const updatedStudent = await foundStudent.save();

    // * RETURN THE UPDATED STUDENT
    return updatedStudent;
  }

  // * METHOD TO DELETE STUDENT
  async deleteStudent(body: DeleteStudentRequestDto): Promise<StudentDocument> {
    this.logger.debug('Inside deleteStudent!');

    const { standard, section, roll, email } = body;

    // * CHECK IF SCHOOL EXITS
    const foundSchool = await this.schoolModel.findOne({ email });

    // * IF SCHOOL WITH THIS EMAIL NOT FOUND
    if (!foundSchool) {
      throw new NotFoundException('There is no school with this email!');
    }

    // * CHECKING A SINGLE STUDENT FROM DB
    const foundStudent = await this.studentModel.findOne({
      schoolId: foundSchool._id,
      standard,
      section,
      roll,
    });

    // * IF NO STUDENTS ARE FOUND THROW ERROR
    if (!foundStudent || foundStudent.isDeleted === true) {
      throw new NotFoundException('No student found!');
    }

    // * AS THE STUDENT IS PRESENT NOW SETTING isDeleted to true
    foundStudent.isDeleted = true;

    // * SAVE THE STUDENT
    const deletedStudent = await foundStudent.save();

    // * RETURN THE DELETED STUDENT
    return deletedStudent;
  }

  // * METHOD TO GET STUDENTS DATA IN CSV
  async getStudentsDetailsCSV(body: DownloadStudentDataRequestDto) {
    this.logger.debug('Inside getStudentsDetailsCSV!');

    const { limit, schoolId } = body;

    // * GET STUDENTS WITH THE PROVIDED SCHOOL ID
    const studentDetails = await this.studentModel
      .find({
        schoolId,
        isDeleted: false,
      })
      .limit(limit);

    // IF NO STUDENTS FOUND
    if (!studentDetails || studentDetails.length === 0) {
      throw new NotFoundException('No students found!');
    }

    // CONVERT STUDENTS DATA INTO CSV FILE
    const csvData = json2csv(studentDetails, { fields: CSV_FIELDS });

    // * RETURN THE PARSE DATA
    return csvData;
  }
}
