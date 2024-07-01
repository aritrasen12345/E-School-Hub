import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SchoolService } from './school.service';
import { CreateSchoolRequestDto, GetSchoolRequestDto } from './dtos';
import { ApiResponse } from 'src/common/interfaces';
import { SchoolDocument } from 'src/common/types';

@ApiTags('school')
@Controller('school')
export class SchoolController {
  private readonly logger = new Logger(SchoolController.name);

  constructor(private readonly schoolService: SchoolService) {}

  // * CREATE SCHOOL
  @Post('/create_school')
  @ApiOperation({
    summary: 'Create school',
    operationId: 'createSchool',
  })
  @ApiOkResponse({
    description: '',
    // type: '' //! TODO DEFINE TYPE
  })
  async createSchool(@Body() body: CreateSchoolRequestDto): Promise<
    ApiResponse<{
      schoolName: string;
      id: string;
      email: string;
    }>
  > {
    this.logger.debug('Inside createSchool!');

    // * CREATING A NEW SCHOOL WITH GIVEN PAYLOAD
    const savedSchoolDetails = await this.schoolService.createNewSchool(body);

    return {
      message:
        'A link has been sent to your email Id, Kindly verify your email to register',
      data: {
        schoolName: savedSchoolDetails?.schoolName,
        id: savedSchoolDetails?.id,
        email: savedSchoolDetails?.email,
      },
    };
  }

  // * GET SCHOOL
  @Post('/get_school')
  @ApiOperation({
    summary: 'Get school',
    operationId: 'getSchool',
  })
  @ApiOkResponse({
    description: 'School record found successfully!',
    // type: '' //! TODO DEFINE TYPE
  })
  async getSchool(
    @Body() body: GetSchoolRequestDto,
  ): Promise<ApiResponse<SchoolDocument>> {
    this.logger.debug('Inside getSchool!');

    // * GET SCHOOL DETAILS
    const getSchoolDetails = await this.schoolService.getSchool(body);

    return {
      message: 'School record found successfully!',
      data: getSchoolDetails,
    };
  }
}
