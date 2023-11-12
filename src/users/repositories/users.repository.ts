import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

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

  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.repository.findOne({
      where: { email },
      relations: { roles: true },
    });
  }

  async findOneById(id: number): Promise<UserEntity> {
    return await this.repository.findOne({
      where: { id },
      relations: { roles: true },
    });
  }

  async updateRoles(id: number, roles?: number[]): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .delete()
      .from('user_roles')
      .where('user_id = :user_id', { user_id: id })
      .execute();

    if (!roles) {
      return;
    }

    const mapped_roles: { user_id: number; role_id: number }[] = roles.map(
      (role) => {
        return {
          user_id: id,
          role_id: role,
        };
      },
    );

    await this.repository
      .createQueryBuilder()
      .insert()
      .into('user_roles')
      .values(mapped_roles)
      .execute();
  }
}
