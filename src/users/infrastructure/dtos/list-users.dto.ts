import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ListUsers } from '@/users/application/usecases/list-users.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ListUsersDto implements ListUsers.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Coluna definida para retornar os dados: "name" ou "createdAt"',
  })
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados crescente ou decrescente',
  })
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado ',
  })
  filter?: string;
}
