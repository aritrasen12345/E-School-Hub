import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { StudentDocument } from 'src/common/types';
import { ApiResponse } from 'src/common/interfaces';
import { CreateStudentRequestDto } from './dtos';

@Controller('user')
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
}
