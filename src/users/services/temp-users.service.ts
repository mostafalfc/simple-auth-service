import { BadRequestException, Injectable } from '@nestjs/common';
import { Client, ClientRMQ } from '@nestjs/microservices';
import configuration from 'src/config/configuration';
import { MailServiceRmqClient } from 'src/config/mail-service-client.rmq';
import { EncryptionService } from 'src/helpers/encryption.service';
import { RolesRepository } from 'src/roles/repositories/roles.repository';
import { DataSource, EntityManager } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { TempUser } from '../entities/temp-user.model';
import { UserStatus } from '../enums';
import { IUser } from '../interfaces/user.interface';
import { TempUsersRepository } from '../repositories/temp-users.repository';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class TempUsersService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly tempUserRepository: TempUsersRepository,
    private readonly userRepository: UsersRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly dataSource: DataSource,
  ) {}

  @Client(MailServiceRmqClient)
  private readonly mailChannel: ClientRMQ;

  async createTempUser(createUserDto: CreateUserDto): Promise<TempUser> {
    createUserDto.password = await this.encryptionService.hash(
      createUserDto.password,
    );
    const is_user_exists = await this.findOneTempUserByEmail(
      createUserDto.email,
    );

    if (is_user_exists) {
      throw new BadRequestException('This user exists.');
    }
    const user = await this.tempUserRepository.create(createUserDto);

    const verify_token = await this.encryptionService.encrypt(
      user._id.toString(),
    );

    this.mailChannel.emit('send-mail', {
      to: user.email,
      link: `${configuration().app.host}:${
        configuration().app.port
      }/users/verify/${verify_token}`,
    });

    return user;
  }

  async verify(token: string): Promise<boolean> {
    const user_id = await this.encryptionService.decrypt(token);
    const result = await this.tempUserRepository.findOneAndVerify(user_id);
    const default_role = await this.rolesRepository.findDefaultRole();
    const user = this.dataSource.transaction(
      async (entityManager: EntityManager) => {
        const user = await this.userRepository
          .attachToTransaction(entityManager)
          .create({
            first_name: result.first_name,
            last_name: result.last_name,
            email: result.email,
            password: result.password,
          });
        await this.userRepository
          .attachToTransaction(entityManager)
          .updateRoles(user.id, [default_role.id]);
        return user;
      },
    );

    return !!user;
  }

  async findOneTempUserByEmail(email: string): Promise<IUser> {
    return await this.tempUserRepository.findOne({ email });
  }

  async deleteTempUsersBetweenDates(
    fromDate: Date,
    toDate: Date,
  ): Promise<number> {
    return await this.tempUserRepository.delete({
      $and: [
        { created_at: { $gte: fromDate } },
        { created_at: { $lt: toDate } },
        { status: UserStatus.temporary },
      ],
    });
  }

  //todo remove this
  async enc(id: string) {
    return this.encryptionService.encrypt(id);
  }
}
