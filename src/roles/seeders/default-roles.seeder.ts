import { Injectable } from '@nestjs/common';
import { RoleStatus } from '../enums';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class DefaultRolesSeeder {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async seed(): Promise<void> {
    const user_role = await this.rolesRepository.findOneByName('user');
    if (!user_role) {
      await this.rolesRepository.create({
        name: 'user',
        description: 'standard user',
        status: RoleStatus.active,
        is_default: true,
      });
    }
    const admin_role = await this.rolesRepository.findOneByName('admin');
    if (!admin_role) {
      await this.rolesRepository.create({
        name: 'admin',
        description: 'system administrator',
        status: RoleStatus.active,
        is_default: false,
      });
    }
  }
}
