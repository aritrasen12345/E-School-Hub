import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from './school.schema';
import { Section, SectionSchema } from './section.schema';

@Schema({
  timestamps: true,
  versionKey: false,
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
export class Standard extends Document {
  @Prop({
    type: String,
    required: true,
  })
  standard_name: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: School.name,
    required: true,
  })
  schoolId: string;

  school?: School;

  @Prop({
    type: SectionSchema,
    required: true,
  })
  sections: Section[];

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

export const StandardSchema = SchemaFactory.createForClass(Standard);

StandardSchema.virtual('school', {
  ref: School.name,
  localField: 'schoolId',
  foreignField: '_id',
  justOne: true,
});
