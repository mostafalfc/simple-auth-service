import { BaseEntity } from 'src/base/base.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToMany } from 'typeorm';
import { RoleStatus } from '../enums';

@Entity('roles')
export class RoleEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_default: boolean;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    nullable: false,
    default: RoleStatus.active,
  })
  status: RoleStatus;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.roles)
  users?: UserEntity[];
}
