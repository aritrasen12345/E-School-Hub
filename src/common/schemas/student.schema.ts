import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from './school.schema';

@Schema({
  versionKey: false,
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (_, ret) {
      delete ret.id;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (_, ret) {
      delete ret.id;
    },
  },
})
export class Student extends Document {
  @ApiProperty({
    type: String,
    required: true,
    description: 'student name property!',
  })
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  parentName: string;

  @Prop({
    type: String,
    required: true,
  })
  gender: string;

  @Prop({
    type: String,
    required: true,
  })
  standard: string;

  @Prop({
    type: String,
    required: true,
  })
  section: string;

  @Prop({
    type: String,
    required: true,
  })
  roll: string;

  @Prop({
    type: String,
    required: true,
  })
  mobileNo: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  address: string;

  @Prop({
    type: String,
    required: true,
  })
  bloodGroup: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  isDeleted: boolean;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: School.name,
    required: true,
  })
  schoolId: string;

  school?: School;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.virtual('school', {
  ref: Student.name,
  localField: 'schoolId',
  foreignField: '_id',
  justOne: true,
});
