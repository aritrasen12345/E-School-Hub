import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from './school.schema';

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
export class RefreshToken extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  token: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: School.name,
    required: true,
  })
  schoolId: string;

  school?: School;

  @Prop({
    type: String,
    required: true,
  })
  ipAddress: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

RefreshTokenSchema.virtual('school', {
  ref: School.name,
  localField: 'schoolId',
  foreignField: '_id',
  justOne: true,
});
