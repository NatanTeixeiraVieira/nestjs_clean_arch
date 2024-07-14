import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests';
import { User } from '@/users/domain/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found using ID FakeId'),
    );
  });

  it('should finds a entity by id', async () => {
    const entity = new User(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUser.id);
    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throws error on update when entity not found', async () => {
    const entity = new User(UserDataBuilder());
    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    );
  });

  it('should updates a entity', async () => {
    const entity = new User(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    entity.update('new name');
    await sut.update(entity);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output.name).toBe('new name');
  });

  it('should throws error on delete when entity not found', async () => {
    const entity = new User(UserDataBuilder());
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found using ID ${entity._id}`),
    );
  });

  it('should delete a entity by id', async () => {
    const entity = new User(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.delete(entity._id);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(output).toBeNull();
  });

  it('should throws error when entity not found', async () => {
    await expect(() => sut.findByEmail('a@a.com')).rejects.toThrow(
      new ConflictError(`UserModel not found using email a@a.com`),
    );
  });

  it('should finds a entity by email', async () => {
    const entity = new User(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });
    const output = await sut.findByEmail('a@a.com');

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('should throws error when entity is found by email', async () => {
    const entity = new User(UserDataBuilder({ email: 'a@a.com' }));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    await expect(() => sut.emailExists('a@a.com')).rejects.toThrow(
      new ConflictError(`Email addres already used`),
    );
  });

  it('should not finds an entity by email', async () => {
    expect.assertions(0);

    await sut.emailExists('a@a.com');
  });

  describe('search method integration tests', () => {
    it('should apply only pagination when the other params are null', async () => {
      const createdAt = new Date();
      const entities: User[] = [];
      const arrange = Array(16).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new User({
            ...element,
            email: `test${index}@main.com`,
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());
      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(User);
      });
      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@main.com`).toBe(item.email);
      });
    });

    it('should search using filter, sort and pagination', async () => {
      const createdAt = new Date();
      const entities: User[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new User({
            ...UserDataBuilder({ name: element }),
            createdAt: new Date(createdAt.getTime() + index),
          }),
        );
      });

      await prismaService.user.createMany({
        data: entities.map((item) => item.toJSON()),
      });

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );

      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
    });
  });
});
