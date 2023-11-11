import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserDto } from '../dto/create-user.dto';
import { TempUser } from '../entities/temp-user.model';
import { UserStatus } from '../enums';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class TempUsersRepository {
  constructor(
    @InjectModel(TempUser.name) private readonly tempUserModel: Model<TempUser>,
  ) {}

  async create(input: CreateUserDto): Promise<TempUser> {
    return await this.tempUserModel.create(input);
  }

  async findOne(filter: FilterQuery<TempUser>): Promise<IUser> {
    return await this.tempUserModel.findOne(filter).lean();
  }

  async find(filter: FilterQuery<TempUser>): Promise<TempUser[]> {
    return await this.tempUserModel.find(filter);
  }

  async delete(filter: FilterQuery<TempUser>): Promise<number> {
    const delete_result = await this.tempUserModel.deleteMany(filter);
    return delete_result.deletedCount;
  }

  async findOneAndVerify(id: string): Promise<TempUser> {
    return await this.tempUserModel.findByIdAndUpdate(id, {
      $set: { status: UserStatus.verified },
    });
  }
}
