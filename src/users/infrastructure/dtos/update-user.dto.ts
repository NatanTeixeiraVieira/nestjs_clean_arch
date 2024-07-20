import { UpdateUser } from '@/users/application/usecases/update-user.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUser.Input, 'id'> {
  @ApiProperty({ description: 'Senha do usuário ' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
