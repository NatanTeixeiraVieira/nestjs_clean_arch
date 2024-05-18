import { ClassValidatorsFields } from '@/shared/domain/validators/class-validators-fields';
import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEmail,
} from 'class-validator';

type UserProps = {
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
};

export class UserRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(100)
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  constructor({ email, name, password, createdAt }: UserProps) {
    Object.assign(this, { email, name, password, createdAt });
  }
}

export class UserValidator extends ClassValidatorsFields<UserProps> {
  validate(data: UserRules): boolean {
    return super.validate(new UserRules(data ?? ({} as UserRules)));
  }
}

export class UserValidatorFactory {
  static create(): UserValidator {
    return new UserValidator();
  }
}
