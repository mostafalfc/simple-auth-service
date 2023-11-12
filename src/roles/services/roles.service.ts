import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(input: CreateRoleDto): Promise<RoleEntity> {
    const default_role = await this.rolesRepository.findDefaultRole();
    if (default_role) {
      throw new ConflictException('Already a default role exists');
    }
    return await this.rolesRepository.create(input);
  }

  async update(id: number, input: Partial<RoleEntity>): Promise<boolean> {
    const default_role = await this.rolesRepository.findDefaultRole();
    if (default_role && input.is_default && id !== default_role.id) {
      throw new ConflictException('Already a default role exists');
    }
    return await this.rolesRepository.update(id, input);
  }

  async delete(id: number): Promise<boolean> {
    return await this.rolesRepository.delete(id);
  }

  async findAllPaginated(
    page: number,
    pageSize: number,
  ): Promise<{ items: RoleEntity[]; count: number }> {
    return this.rolesRepository.findAllPaginated(page, pageSize);
  }
}
