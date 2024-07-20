import { UpdatePassword } from '@/users/application/usecases/update-password.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto implements Omit<UpdatePassword.Input, 'id'> {
  @ApiProperty({ description: 'Nova senha do usuário' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Senha atual do usuário' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
