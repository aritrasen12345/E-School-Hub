import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { StandardService } from './standard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateStandardRequestDto,
  DeleteStandardRequestDto,
  GetStandardsListRequestDto,
  StandardResponseDto,
  UpdateStandardRequestDto,
} from './dtos';
import { ApiResponse } from 'src/common/interfaces';
import { StandardDocument } from 'src/common/types';

@ApiTags('standard')
@Controller('standard')
export class StandardController {
  private readonly logger = new Logger(StandardController.name);

  constructor(private readonly standardService: StandardService) {}

  // * CREATE STANDARD
  @Post('/create_standard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create standard',
    operationId: 'createStandard',
  })
  @ApiOkResponse({
    description: 'Standard created successfully!',
    type: StandardResponseDto,
  })
  async createStandard(
    @Body() body: CreateStandardRequestDto,
  ): Promise<ApiResponse<StandardDocument>> {
    this.logger.debug('Inside createStandard!');

    const { schoolId, standard_name, sections } = body;

    // * CREATE STANDARD FOR A SCHOOL
    const standardDetails = await this.standardService.createStandard(
      schoolId,
      standard_name,
      sections,
    );

    return {
      message: 'Standard created successfully!',
      data: standardDetails,
    };
  }

  // * GET STANDARD LIST
  @Post('/get_standards_list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get standards list!',
    operationId: 'getStandardsList',
  })
  @ApiOkResponse({
    description: 'Standard found successfully!',
    type: [StandardResponseDto],
  })
  async getStandardBySchool(
    @Body() body: GetStandardsListRequestDto,
  ): Promise<ApiResponse<StandardDocument[]>> {
    this.logger.debug('Inside getStandardBySchool!');

    // * GET STANDARDS BY SCHOOL
    const standardDetails = await this.standardService.getStandardBySchool(
      body?.schoolId,
    );

    return { message: 'Standard found successfully', data: standardDetails };
  }

  // * UPDATE STANDARD
  @Post('/update_standard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Update standard',
    operationId: 'updateStandard',
  })
  @ApiOkResponse({
    description: 'Standard updated successfully!',
    type: StandardResponseDto,
  })
  async updateStandard(
    @Body() body: UpdateStandardRequestDto,
  ): Promise<ApiResponse<StandardDocument>> {
    this.logger.debug('Inside updateStandard!');

    // * UPDATE STANDARD
    const standardDetails = await this.standardService.updateStandard(body);

    return {
      message: 'Standard updated successfully!',
      data: standardDetails,
    };
  }

  // * DELETE STANDARD
  @Post('/delete_standard')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete standard',
    operationId: 'deleteStandard',
  })
  @ApiOkResponse({
    description: 'Standard deleted successfully!',
    type: StandardResponseDto,
  })
  async deleteStandard(
    @Body() body: DeleteStandardRequestDto,
  ): Promise<ApiResponse<StandardDocument>> {
    this.logger.debug('Inside deleteStandard!');

    // * DELETE STANDARD DETAILS
    const standardDetails = await this.standardService.deleteStandard(body);

    return {
      message: 'Standard deleted successfully!',
      data: standardDetails,
    };
  }
}
