import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: false,
  _id: false,
})
export class Section extends Document {
  @Prop({
    type: String,
    required: true,
  })
  label: string;

  @Prop({
    type: String,
    required: true,
  })
  value: string;
}

export const SectionSchema = SchemaFactory.createForClass(Section);
