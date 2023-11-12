import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from 'src/helpers/helpers.module';
import { RolesController } from './controllers/roles.controller';
import { RoleEntity } from './entities/role.entity';
import { RolesRepository } from './repositories/roles.repository';
import { DefaultRolesSeeder } from './seeders/default-roles.seeder';
import { RolesService } from './services/roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity]), HelpersModule],
  providers: [DefaultRolesSeeder, RolesRepository, RolesService],
  controllers: [RolesController],
  exports: [RolesRepository],
})
export class RolesModule implements OnApplicationBootstrap {
  constructor(private readonly seeder: DefaultRolesSeeder) {}
  async onApplicationBootstrap() {
    await this.seeder.seed();
  }
}
