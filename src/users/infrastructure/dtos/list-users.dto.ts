import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsers } from '@/users/application/usecases/list-users.usecase';

export class ListUsersDto implements ListUsers.Input {
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
  filter?: string;
}
