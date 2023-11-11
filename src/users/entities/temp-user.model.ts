import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserStatus } from '../enums';
import { IUser } from '../interfaces/user.interface';

@Schema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class TempUser extends Document implements IUser {
  @Prop({ type: String, required: true })
  first_name: string;

  @Prop({ type: String, required: true })
  last_name: string;

  @Prop({ type: String, required: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 8 })
  password: string;

  @Prop({
    type: String,
    required: true,
    default: UserStatus.temporary,
    enum: Object.values(UserStatus),
  })
  status: UserStatus;

  created_at: Date;
  updated_at: Date;
}

export const TempUserSchema = SchemaFactory.createForClass(TempUser);
