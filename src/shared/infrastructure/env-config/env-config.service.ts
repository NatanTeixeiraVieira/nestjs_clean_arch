import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
  constructor(private readonly configService: ConfigService) {}

  getPort(): number {
    return +this.configService.get<number>('PORT');
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV');
  }
}
