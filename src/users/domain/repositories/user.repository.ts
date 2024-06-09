import { User } from '../entities/user.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace UserRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<User, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      User,
      Filter,
      SearchParams,
      SearchResult
    > {
    findByEmail(email: string): Promise<User>;

    emailExists(email: string): Promise<void>;
  }
}
