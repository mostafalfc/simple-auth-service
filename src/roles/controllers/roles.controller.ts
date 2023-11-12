import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AdminGuard } from 'src/base/admin.guard';
import { UserGuard } from 'src/base/user.guard';
import { CreateRoleDto } from '../dto/create-role.dto';
import { FindOneRoleDto } from '../dto/find-one-role.dto';
import { GetRolesPaginated } from '../dto/get-roles-paginated.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RolesService } from '../services/roles.service';

@Controller('roles')
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: CreateRoleDto) {
    return this.rolesService.create(body);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async delete(@Param() param: FindOneRoleDto) {
    return await this.rolesService.delete(param.id);
  }

  @Put('/:id')
  @UseGuards(AdminGuard)
  async update(@Param() param: FindOneRoleDto, @Body() body: UpdateRoleDto) {
    return await this.rolesService.update(param.id, body);
  }

  @Get()
  @UseGuards(UserGuard)
  async getAll(@Query() query: GetRolesPaginated) {
    return this.rolesService.findAllPaginated(query.page, query.page_size);
  }
}
