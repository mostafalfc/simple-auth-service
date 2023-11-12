import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from 'src/base/auth.guard';
import { UserGuard } from 'src/base/user.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { TempLoginDto } from '../dto/temp-login.dto';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { AuthService } from '../services/auth.service';
import { TempUsersService } from '../services/temp-users.service';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly tempUsersService: TempUsersService,
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.tempUsersService.createTempUser(body);
  }

  @Patch('/verify/:token')
  async verify(@Param() param: VerifyUserDto) {
    return await this.tempUsersService.verify(param.token);
  }

  //todo remove this
  @Patch('/enc/:token')
  async enc(@Param() param: VerifyUserDto) {
    return await this.tempUsersService.enc(param.token);
  }

  @Throttle({ default: { ttl: 15000, limit: 1 } })
  @Post('/temp-login')
  async tempLogin(@Body() body: TempLoginDto) {
    return await this.authService.tempLogin(body);
  }

  @Throttle({ default: { ttl: 15000, limit: 1 } })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/login/:role_id')
  async Login(@Param() param: LoginDto, @Req() request: Request) {
    return await this.authService.login(request['key'], param.role_id);
  }

  @Get('/profile')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  async getUser(@Req() request: Request) {
    return await this.userService.extractUserFromRedis(request['key']);
  }
}
