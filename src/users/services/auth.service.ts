import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EncryptionService } from 'src/helpers/encryption.service';
import { LoginDto } from '../dto/login.dto';
import { IUser } from '../interfaces/user.interface';
import { TempUsersRepository } from '../repositories/temp-users.repository';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tempUserRepository: TempUsersRepository,
    private readonly encryptionService: EncryptionService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async login(input: LoginDto): Promise<any> {
    let user: IUser = await this.userRepository.findOneByEmail(input.email);
    if (!user) {
      user = await this.tempUserRepository.findOne({ email: input.email });
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const is_password_correct = await this.encryptionService.compare(
      input.password,
      user.password,
    );

    if (!is_password_correct) {
      throw new BadRequestException('Authentication failed');
    }
    //todo logs logins in mongo

    //todo generate token
    //todo save token in redis
    this.redis.hset('key', 'object');
    return {};
  }
}
