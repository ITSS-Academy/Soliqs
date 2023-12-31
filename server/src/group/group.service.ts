/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { HttpException, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './entities/group.entity';
import { Model } from 'mongoose';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    try {
      const group = new this.groupModel(createGroupDto);
      return await group.save();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll(uid: string) {
    try {
      const groups = await this.groupModel
        .find({ members: { $ne: uid } })
        .populate('members', 'userName displayName avatar', this.profileModel)
        .exec();

      return groups;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findOne(id: string): Promise<Group> {
    try {
      const group = await this.groupModel
        .findOne({ _id: id })
        .populate('members', 'userName displayName avatar', this.profileModel);
      return group;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findJoinedGroups(uid: string): Promise<Group[]> {
    try {
      const groups = await this.groupModel
        .find({ members: uid })
        .populate('members', 'userName displayName avatar', this.profileModel);
      return groups;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async update(id: string, updateGroupDto: UpdateGroupDto) {
    try {
      const updatedGroup = await this.groupModel.findOneAndUpdate(
        { id: id },
        { ...updateGroupDto },
        { new: true },
      );
      return updatedGroup;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async join(id: string, userId: string) {
    try {
      const updatedGroup = await this.groupModel.findOneAndUpdate(
        { _id: id },
        { $addToSet: { members: userId } },
        { new: true },
      );
      return updatedGroup;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remove(id: string) {
    try {
      const deleteGroup = await this.groupModel.findOneAndDelete({ id: id });
      return deleteGroup;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByName(name: string): Promise<Group> {
    try {
      const group = await this.groupModel.findOne({ name: name });
      return group;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
