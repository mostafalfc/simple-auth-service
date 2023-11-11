import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { AuthService } from './services/auth.service';
import { TempUsersService } from './services/temp-users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly tempUsersService: TempUsersService,
    private readonly authService: AuthService,
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
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }
}
