import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/reporitories/user-in-memory.repository';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { User } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { DeleteUser } from '../../delete-user.usecase';

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUser.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new DeleteUser.UseCase(repository);
  });

  it('should throws error when entity was not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('Entity not found'),
    );
  });

  it('should delete a user', async () => {
    const spyDelete = jest.spyOn(repository, 'delete');

    const items = [new User(UserDataBuilder({}))];
    repository.items = items;

    expect(repository.items).toHaveLength(1);
    await sut.execute({ id: items[0]._id });
    expect(spyDelete).toHaveBeenCalledTimes(1);
    expect(repository.items).toHaveLength(0);
  });
});
