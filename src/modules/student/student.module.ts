import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  School,
  SchoolSchema,
  Student,
  StudentSchema,
} from 'src/common/schemas';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [
    // * IMPORT STUDENT && SCHOOL MONGOOSE MODULE
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
      {
        name: School.name,
        schema: SchoolSchema,
      },
    ]),

    // * IMPORT SCHOOL MODULE
    SchoolModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
