import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { RoleStatus } from '../enums';

export class UpdateRoleDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  description: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  @ApiProperty({ type: String })
  is_default: boolean;

  @IsOptional()
  @IsEnum(RoleStatus)
  @ApiProperty({ type: String })
  status: RoleStatus;
}
