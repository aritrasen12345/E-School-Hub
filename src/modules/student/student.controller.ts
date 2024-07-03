import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentDocument } from 'src/common/types';
import { ApiResponse } from 'src/common/interfaces';
import { CreateStudentRequestDto, GetStudentRequestDto } from './dtos';
import { GetStudentsBySchoolRequestDto } from './dtos/get_students_by_school_request.dto';

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
}
