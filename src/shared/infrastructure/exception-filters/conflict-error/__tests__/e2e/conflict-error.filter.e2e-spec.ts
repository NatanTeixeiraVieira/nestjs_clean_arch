import { Controller, Get, INestApplication } from '@nestjs/common';
import { ConflictErrorFilter } from '../../conflict-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ConflictError } from '../../../../../domain/errors/conflict-error';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ConflictError('Conflicting data');
  }
}

describe('ConflictErrorFilter', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new ConflictErrorFilter());
    await app.init();
  }, 30000);

  it('should be defined', () => {
    expect(new ConflictErrorFilter()).toBeDefined();
  });

  it('should catch a ConflictError', () => {
    return request(app.getHttpServer()).get('/stub').expect(409).expect({
      statusCode: 409,
      error: 'Conflict',
      message: 'Conflicting data',
    });
  });
});
