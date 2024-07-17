import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Signup } from '../../signup.usecase';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider';
import { UpdatePassword } from '../../update-password.usecase';
import { User } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { rejects } from 'assert';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error';

describe('UpdatePasswordUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdatePassword.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  let hashProvider: HashProvider;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
    hashProvider = new BcryptHashProvider();
  });

  beforeEach(async () => {
    sut = new UpdatePassword.UseCase(repository, hashProvider);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should throws error when entity is found by ID', async () => {
    const entity = new User(UserDataBuilder({}));

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'Old password',
        password: 'New password',
      }),
    ).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    );
  });

  it('should throws error when old password is not provided', async () => {
    const entity = new User(UserDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: '',
        password: 'New password',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password are required`),
    );
  });

  it('should throws error when new password is not provided', async () => {
    const entity = new User(UserDataBuilder({}));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() =>
      sut.execute({
        id: entity._id,
        oldPassword: 'Old password',
        password: '',
      }),
    ).rejects.toThrow(
      new InvalidPasswordError(`Old password and new password are required`),
    );
  });

  it('should updates a password', async () => {
    const oldPassword = await hashProvider.generateHash('1234');
    const entity = new User(UserDataBuilder({ password: oldPassword }));

    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      id: entity._id,
      oldPassword: '1234',
      password: 'NewPassword',
    });

    const result = await hashProvider.compareHash(
      'NewPassword',
      output.password,
    );

    expect(result).toBeTruthy();
  });
});
