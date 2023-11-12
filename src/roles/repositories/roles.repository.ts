import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RolesRepository {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repository: Repository<RoleEntity>,
  ) {}

  attachToTransaction(entityManager?: EntityManager): RolesRepository {
    return entityManager
      ? new RolesRepository(entityManager.withRepository(this.repository))
      : this;
  }

  async create(input: Partial<RoleEntity>): Promise<RoleEntity> {
    return await this.repository.save(input);
  }

  async update(id: number, input: Partial<RoleEntity>): Promise<boolean> {
    return (await this.repository.update(id, input)).affected > 0;
  }

  async delete(id: number): Promise<boolean> {
    return (await this.repository.delete(id)).affected > 0;
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: RoleEntity[]; count: number }> {
    const roles = await this.repository.findAndCount({
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
    return {
      items: roles[0],
      count: roles[1],
    };
  }

  async findOneByName(name: string): Promise<RoleEntity> {
    return this.repository.findOne({ where: { name } });
  }

  async findOneById(id: number): Promise<RoleEntity> {
    return this.repository.findOne({ where: { id } });
  }

  async findDefaultRole(): Promise<RoleEntity> {
    return this.repository.findOne({ where: { is_default: true } });
  }
}
