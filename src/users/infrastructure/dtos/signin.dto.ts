import { Signin } from '@/users/application/usecases/signin.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class SigninDto implements Signin.Input {
  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  password: string;
}
