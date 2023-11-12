import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EncryptionService } from 'src/helpers/encryption.service';
import { LogsEvent, LogsMessage } from 'src/logs/enums';
import { LogsRepository } from 'src/logs/repositories/logs.repository';
import { v4 as uuid } from 'uuid';
import { TempLoginDto } from '../dto/temp-login.dto';
import { UserEntity } from '../entities/user.entity';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly encryptionService: EncryptionService,
    @InjectRedis() private readonly redis: Redis,
    private readonly logsRepository: LogsRepository,
  ) {}

  async tempLogin(input: TempLoginDto): Promise<any> {
    const user = await this.userRepository.findOneByEmail(input.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const is_password_correct = await this.encryptionService.compare(
      input.password,
      user.password,
    );

    if (!is_password_correct) {
      await this.logsRepository.create({
        event: LogsEvent.login,
        user_id: user.id,
        message: LogsMessage.wrong_password,
      });
      throw new BadRequestException('Authentication failed');
    }

    await this.logsRepository.create({
      event: LogsEvent.login,
      user_id: user.id,
      message: LogsMessage.successful_login,
    });
    const redis_key = uuid();
    this.redis.hset(redis_key, user);
    const token_payload = {
      key: redis_key,
    };
    const token = await this.encryptionService.encrypt(token_payload);

    return { token, roles: user.roles };
  }

  async login(key: string, roleId: number) {
    const user_data = plainToClass(UserEntity, await this.redis.hgetall(key));
    const user = await this.userRepository.findOneById(user_data.id);
    const role = user.roles.find((role) => (role.id = roleId));
    if (!role) {
      throw new ForbiddenException('Role is invalid');
    }
    const redis_data = {
      role: role.name,
      user: JSON.stringify(user),
    };
    await this.redis.del(key);
    await this.redis.hset(key, redis_data);

    const token_payload = {
      key,
      role: role.name,
    };
    const token = await this.encryptionService.encrypt(token_payload);
    return token;
  }
}
