import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpersModule } from 'src/helpers/helpers.module';
import { TempUser, TempUserSchema } from './entities/temp-user.model';
import { UserEntity } from './entities/user.entity';
import { DeleteTempUsersJob } from './jobs/delete-temp-users.job';
import { TempUsersRepository } from './repositories/temp-users.repository';
import { UsersRepository } from './repositories/users.repository';
import { AuthService } from './services/auth.service';
import { TempUsersService } from './services/temp-users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TempUser.name,
        schema: TempUserSchema,
      },
    ]),
    TypeOrmModule.forFeature([UserEntity]),
    BullModule.registerQueue({
      name: 'jobs',
    }),
    HelpersModule,
  ],
  controllers: [UsersController],
  providers: [
    TempUsersService,
    TempUsersRepository,
    DeleteTempUsersJob,
    UsersRepository,
    AuthService,
  ],
})
export class UsersModule {}
