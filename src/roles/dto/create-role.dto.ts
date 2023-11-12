import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { RoleStatus } from '../enums';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  description: string;

  @IsBoolean()
  @IsDefined()
  @Type(() => Boolean)
  @ApiProperty({ type: String })
  is_default: boolean;

  @IsDefined()
  @IsEnum(RoleStatus)
  @ApiProperty({ type: String })
  status: RoleStatus;
}
