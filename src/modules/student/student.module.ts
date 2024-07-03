import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/common/schemas';
import { SchoolModule } from '../school/school.module';

@Module({
  imports: [
    // * IMPORT STUDENT MONGOOSE MODULE
    MongooseModule.forFeature([
      {
        name: Student.name,
        schema: StudentSchema,
      },
    ]),

    // * IMPORT SCHOOL MODULE
    SchoolModule,
  ],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
