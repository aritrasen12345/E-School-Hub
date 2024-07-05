import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
export class School extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: true,
  })
  schoolName: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    type: String,
  })
  verifyToken: string;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
