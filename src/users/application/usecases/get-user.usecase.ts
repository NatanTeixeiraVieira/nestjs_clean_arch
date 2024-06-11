import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';

export namespace GetUser {
  export type Input = {
    id: number;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private readonly userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
