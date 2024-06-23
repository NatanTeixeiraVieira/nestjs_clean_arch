import { Signin } from '@/users/application/usecases/signin.usecase';

export class SigninDto implements Signin.Input {
  email: string;
  password: string;
}
