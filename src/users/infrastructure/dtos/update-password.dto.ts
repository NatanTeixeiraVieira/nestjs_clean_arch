import { UpdatePassword } from '@/users/application/usecases/update-password.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto implements Omit<UpdatePassword.Input, 'id'> {
  @ApiProperty({ description: 'Nova senha do usuário' })
  password: string;

  @ApiProperty({ description: 'Senha atual do usuário' })
  oldPassword: string;
}
