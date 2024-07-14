import { PrismaClient, User as PriasmaUser } from '@prisma/client';
import { UserModelMapper } from '../../user-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { User } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  }, 60000);

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: '6e47e6e6-aabd-40b3-8005-dd20e05808ae',
      name: 'Test name',
      email: 'a@a.com',
      password: 'TestPassword123',
      createdAt: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('should throws error when user model is invalid', () => {
    const model: PriasmaUser = Object.assign(props, { name: null });
    expect(() => UserModelMapper.toEntity(model)).toThrow(ValidationError);
  });

  it('should convert user model to a user entity', async () => {
    const model: PriasmaUser = await prismaService.user.create({
      data: props,
    });
    const sut = UserModelMapper.toEntity(model);
    expect(sut).toBeInstanceOf(User);
    expect(sut.toJSON()).toStrictEqual(props);
  });
});
