import { BaseEntity } from 'src/base/base.entity';
import { Column, Entity } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

@Entity('users')
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', nullable: false })
  first_name: string;

  @Column({ type: 'varchar', nullable: false })
  last_name: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
