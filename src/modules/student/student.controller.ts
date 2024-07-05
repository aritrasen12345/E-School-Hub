import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentDocument } from 'src/common/types';
import { ApiResponse } from 'src/common/interfaces';
import {
  CreateStudentRequestDto,
  DeleteStudentRequestDto,
  DownloadStudentDataRequestDto,
  GetStudentRequestDto,
  UpdateStudentRequestDto,
} from './dtos';
import { GetStudentsBySchoolRequestDto } from './dtos/get_students_by_school_request.dto';
import { Response } from 'express';

@ApiTags('student')
@Controller('student')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(private readonly studentService: StudentService) {}

  // * CREATE STUDENT
  @Post('/create_student')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create student',
    operationId: 'createStudent',
  })
  @ApiOkResponse({
    description: 'Student created successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async createStudent(
    @Body() body: CreateStudentRequestDto,
  ): Promise<ApiResponse<StudentDocument>> {
    this.logger.debug('Inside createStudent!');

    // * CREATE STUDENT
    const newStudent = await this.studentService.createStudent(body);

    return { message: 'Student created successfully!', data: newStudent };
  }

  // * GET ALL THE STUDENTS OF EVERY SCHOOL
  @Get('/get_students')
  @ApiOperation({
    summary: 'Get students',
    operationId: 'getStudents',
  })
  @ApiOkResponse({
    description: 'Successfully fetched students!',
    // type: '' //! TODO DEFINE TYPE
  })
  async getStudents(): Promise<ApiResponse<StudentDocument[]>> {
    this.logger.debug('Inside getStudents!');

    // * FETCH ALL AVAILABLE STUDENTS FROM DB
    const foundStudents = await this.studentService.getStudents();

    return {
      message: 'Successfully fetched students',
      data: foundStudents,
    };
  }

  // * TO GET ALL THE STUDENTS OF EVERY SCHOOL
  @Post('/get_students_by_school')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get students by school',
    operationId: 'getStudentsBySchool',
  })
  @ApiOkResponse({
    description: 'Students found!',
    // type: //! TODO DEFINE TYPE
  })
  async getStudentsBySchool(
    @Body() body: GetStudentsBySchoolRequestDto,
  ): Promise<
    ApiResponse<{ studentList: StudentDocument[]; countStudents: number }>
  > {
    this.logger.debug('Inside getStudentsBySchool!');

    // * GET STUDENTS BY SCHOOL
    const foundStudents = await this.studentService.getStudentsBySchool(body);

    return { message: 'Students found!', data: foundStudents };
  }

  // * GET STUDENT
  @Post('/get_student')
  @ApiOperation({
    summary: 'Get student',
    operationId: 'getStudent',
  })
  @ApiOkResponse({
    description: 'Successfully fetched student!',
    // type: '' //! TODO DEFINE TYPE
  })
  async getStudent(
    @Body() body: GetStudentRequestDto,
  ): Promise<ApiResponse<StudentDocument>> {
    this.logger.debug('Inside getStudent!');

    // * FIND STUDENT
    const foundStudent = await this.studentService.getStudent(body);

    return {
      message: 'Successfully fetched student!',
      data: foundStudent,
    };
  }

  // * UPDATE STUDENT
  @Post('/update_student')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update student',
    operationId: 'updateStudent',
  })
  @ApiOkResponse({
    description: 'Student updated successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async updateStudent(@Body() body: UpdateStudentRequestDto): Promise<
    ApiResponse<{
      name: string;
      parentName: string;
      standard: string;
      section: string;
      roll: string;
      mobileNo: string;
      address: string;
    }>
  > {
    this.logger.debug('Inside updateStudent!');

    // * UPDATE STUDENT
    const modifiedStudent = await this.studentService.updateStudent(body);

    return {
      message: 'Student updated successfully!',
      data: {
        name: modifiedStudent?.name,
        parentName: modifiedStudent?.parentName,
        standard: modifiedStudent?.standard,
        section: modifiedStudent?.section,
        roll: modifiedStudent?.roll,
        mobileNo: modifiedStudent?.mobileNo,
        address: modifiedStudent?.address,
      },
    };
  }

  // * DELETE STUDENT
  @Post('/delete_student')
  @ApiOperation({ summary: 'Delete student!', operationId: 'deleteStudent' })
  @ApiOkResponse({
    description: 'Student deleted successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async deleteStudent(@Body() body: DeleteStudentRequestDto): Promise<
    ApiResponse<{
      name: string;
      class: string;
      id: string;
      isDeleted: boolean;
    }>
  > {
    this.logger.debug('Inside deleteStudent!');

    // * DELETE STUDENT
    const deletedStudent = await this.studentService.deleteStudent(body);

    return {
      message: 'Student deleted successfully!',
      data: {
        name: deletedStudent?.name,
        class: deletedStudent?.standard,
        id: deletedStudent?.id,
        isDeleted: deletedStudent?.isDeleted,
      },
    };
  }

  @Post('/download_student_data')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Download student data',
    operationId: 'downloadStudentData',
  })
  @ApiOkResponse({
    description: 'Successfully downloaded student data!',
    // type: '' //! TODO DEFINE TYPE
  })
  async downloadStudentData(
    @Body() body: DownloadStudentDataRequestDto,
    @Res() res: Response,
  ) {
    this.logger.debug('Inside downloadStudentData!');

    // * GET CSV DATA
    const csvData = await this.studentService.getStudentsDetailsCSV(body);

    /**
     * THESE HEADERS ARE REQUIRED TO INDICATE THE FRONTEND THAT THE API WILL RETURN BLOB DATA
     */
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=student_data.csv',
    );

    res.status(200).send(csvData);
  }
}
