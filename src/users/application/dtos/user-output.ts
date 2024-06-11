import { User } from '@/users/domain/entities/user.entity';

export type UserOutput = {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserOutputMapper {
  static toOutput(entity: User): UserOutput {
    return entity.toJSON();
  }
}
