import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ type: String, required: true })
  password: string;
}
