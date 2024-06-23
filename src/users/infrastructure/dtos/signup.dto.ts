import { Signup } from '@/users/application/usecases/signup.usecase';

export class SignupDto implements Signup.Input {
  name: string;
  email: string;
  password: string;
}
