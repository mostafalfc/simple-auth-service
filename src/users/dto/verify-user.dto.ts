import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  token: string;
}
