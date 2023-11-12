import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class GetRolesPaginated {
  @Min(1)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @ApiPropertyOptional({ default: 1 })
  page?: number;

  @Min(1)
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  page_size?: number;
}
