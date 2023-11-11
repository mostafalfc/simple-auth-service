import { RedisModule } from '@nestjs-modules/ioredis';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { HelpersModule } from './helpers/helpers.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(configuration().database.mongo),
    BullModule.forRoot({
      redis: {
        host: configuration().cache.host,
        port: configuration().cache.port,
      },
    }),
    JwtModule.register({
      global: true,
      secret: configuration().encryption.jwt_secret,
    }),
    TypeOrmModule.forRoot({
      url: configuration().database.postgres_url,
      ...configuration().database.type_orm_option,
      type: 'postgres',
    }),
    ThrottlerModule.forRoot([configuration().rate_limit]),
    RedisModule.forRoot({ config: configuration().cache }),
    HelpersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
