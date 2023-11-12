import { Type } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

export class FindOneRoleDto {
  @IsNumber()
  @IsDefined()
  @Type(() => Number)
  id: number;
}
