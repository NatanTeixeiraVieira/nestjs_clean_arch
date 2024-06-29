import { UpdateUser } from '@/users/application/usecases/update-user.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto implements Omit<UpdateUser.Input, 'id'> {
  @ApiProperty({ description: 'Senha do usuário ' })
  name: string;
}
