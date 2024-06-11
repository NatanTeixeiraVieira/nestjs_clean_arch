import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

export namespace DeleteUser {
  export type Input = {
    id: number;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.userRepository.delete(input.id);
    }
  }
}
