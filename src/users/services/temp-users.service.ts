import { BadRequestException, Injectable } from '@nestjs/common';
import { EncryptionService } from 'src/helpers/encryption.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { TempUser } from '../entities/temp-user.model';
import { UserStatus } from '../enums';
import { IUser } from '../interfaces/user.interface';
import { TempUsersRepository } from '../repositories/temp-users.repository';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class TempUsersService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly tempUserRepository: TempUsersRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async createTempUser(createUserDto: CreateUserDto): Promise<TempUser> {
    createUserDto.password = await this.encryptionService.hash(
      createUserDto.password,
    );
    const is_user_exists = await this.findOneTempUserByEmail(
      createUserDto.email,
    );

    if (is_user_exists) {
      throw new BadRequestException('This user exists.');
    }
    const user = await this.tempUserRepository.create(createUserDto);
    //todo send email
    return user;
  }

  async verify(token: string): Promise<boolean> {
    const user_id = await this.encryptionService.decrypt(token);
    const result = await this.tempUserRepository.findOneAndVerify(user_id);
    const user = await this.userRepository.create({
      first_name: result.first_name,
      last_name: result.last_name,
      email: result.email,
      password: result.password,
    });
    return !!user;
  }

  async findOneTempUserByEmail(email: string): Promise<IUser> {
    return await this.tempUserRepository.findOne({ email });
  }

  async deleteTempUsersBetweenDates(
    fromDate: Date,
    toDate: Date,
  ): Promise<number> {
    return await this.tempUserRepository.delete({
      $and: [
        { created_at: { $gte: fromDate } },
        { created_at: { $lt: toDate } },
        { status: UserStatus.temporary },
      ],
    });
  }

  //todo remove this
  async enc(id: string) {
    return this.encryptionService.encrypt(id);
  }
}
