import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  attachToTransaction(entityManager?: EntityManager): UsersRepository {
    return entityManager
      ? new UsersRepository(entityManager.withRepository(this.repository))
      : this;
  }

  async create(input: Partial<UserEntity>): Promise<UserEntity> {
    return await this.repository.save(input);
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.repository.findOne({ where: { email } });
  }
}
