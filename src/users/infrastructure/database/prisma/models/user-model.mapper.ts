import { ValidationError } from '@/shared/domain/errors/validation-error';
import { User } from '@/users/domain/entities/user.entity';
import { User as UserPrisma } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: UserPrisma) {
    const data = {
      name: model.name,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
    };

    try {
      return new User(data, model.id);
    } catch (error) {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
