import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import configuration from 'src/config/configuration';

@Injectable()
export class EncryptionService {
  constructor(private readonly jwtService: JwtService) {}
  SALT = 10;
  IV = randomBytes(16);

  async hash(input: string): Promise<string> {
    return await bcrypt.hash(input, this.SALT);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(input, hash);
  }

  async encrypt(input: any): Promise<string> {
    return await this.jwtService.signAsync(input);
  }

  async decrypt(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, {
      secret: configuration().encryption.jwt_secret,
    });
  }
}
