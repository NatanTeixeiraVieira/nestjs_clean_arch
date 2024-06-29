import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config.service';
import { EnvConfigModule } from '../../env-config.module';

describe('EnvConfigService unit tests', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should get port number', () => {
    expect(sut.getPort()).toBe(3000);
  });

  it('should get node env', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });

  it('should get JWT secret', () => {
    expect(sut.getJwtSecret()).toBe('fake_secret');
  });

  it('should get JWT Expires In Seconds', () => {
    expect(sut.getJwtExpiresInSeconds()).toBe(86400);
  });
});
