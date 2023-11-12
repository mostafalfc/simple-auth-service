import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async extractUserFromRedis(key: string): Promise<UserEntity> {
    const user_data = plainToClass(UserEntity, await this.redis.hgetall(key));
    return await this.usersRepository.findOneById(user_data.id);
  }
}
