/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail } from 'class-validator';
import mongoose, { HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  displayName: string;

  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  phone: string;

  @Prop({ default: null })
  country: string;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  cover: string;

  @Prop({ default: null })
  bio: string;

  @Prop({ default: null })
  gender: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  followers: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  following: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  blocked: string[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
