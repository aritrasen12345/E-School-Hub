import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Student extends Document {
  @ApiProperty({
    type: String,
  })
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  // parentName
  // gender
  //standard
  // section
  // roll
  // mobileNo
  // address
  // bloodGroup
  // isDeleted
  // schoolId
}

export const StudentSchema = SchemaFactory.createForClass(Student);
