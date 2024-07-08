import { User } from '@/users/domain/entities/user.entity';
import { UserInMemoryRepository } from '../../user-in-memory.repository';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('UserInMemoryRepository unit tests', () => {
  let sut: UserInMemoryRepository;

  beforeEach(() => {
    sut = new UserInMemoryRepository();
  });

  it('should throw error when no found - findByEmail method', async () => {
    await expect(sut.findByEmail('a@a.com')).rejects.toThrow(
      new NotFoundError('Entity was not found using email a@a.com'),
    );
  });

  it('should find a entity by email - findByEmail method', async () => {
    const entity = new User(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findByEmail(entity.email);
    expect(entity.toJSON()).toStrictEqual(result.toJSON());
  });

  it('should throw error when no found - emailExists method', async () => {
    const entity = new User(UserDataBuilder({}));
    await sut.insert(entity);
    await expect(sut.emailExists(entity.email)).rejects.toThrow(
      new ConflictError('Email address already used'),
    );
  });

  it('should find a entity by email - findByEmail method', async () => {
    expect.assertions(0);
    await sut.emailExists('a@a.com');
  });

  it('should no filter items when filter object is null', async () => {
    const entity = new User(UserDataBuilder({}));
    await sut.insert(entity);
    const result = await sut.findAll();
    const spyFilter = jest.spyOn(result, 'filter');
    const itemsFilterd = await sut['applyFilter'](result, null);
    expect(spyFilter).not.toHaveBeenCalled();
    expect(itemsFilterd).toStrictEqual(result);
  });

  it('should filter name field useing filter param', async () => {
    const items = [
      new User(UserDataBuilder({ name: 'Test' })),
      new User(UserDataBuilder({ name: 'TEST' })),
      new User(UserDataBuilder({ name: 'fake' })),
    ];
    const spyFilter = jest.spyOn(items, 'filter');
    const itemsFilterd = await sut['applyFilter'](items, 'TEST');
    expect(spyFilter).toHaveBeenCalled();
    expect(itemsFilterd).toStrictEqual([items[0], items[1]]);
  });

  it('should sort by createdAt  ', async () => {
    const createdAt = new Date();
    const items = [
      new User(UserDataBuilder({ name: 'Test', createdAt })),
      new User(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new User(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ];
    const itemsSorted = await sut['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it('should sort by name field', async () => {
    const items = [
      new User(UserDataBuilder({ name: 'c' })),
      new User(UserDataBuilder({ name: 'd' })),
      new User(UserDataBuilder({ name: 'a' })),
    ];
    let itemsSorted = await sut['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]]);

    itemsSorted = await sut['applySort'](items, 'name', null);
    expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]]);
  });
});
