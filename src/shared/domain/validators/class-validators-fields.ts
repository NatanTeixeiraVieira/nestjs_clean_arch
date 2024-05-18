import { validateSync } from 'class-validator';
import {
  FieldsError,
  ValidatorFieldsInterface,
} from './validator-filds.interface';

export abstract class ClassValidatorsFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  errors: FieldsError = null;
  validatedData: PropsValidated = null;

  validate(data: PropsValidated): boolean {
    const errors = validateSync(data as object);

    if (errors.length) {
      this.errors = {};
      errors.forEach((error) => {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints);
      });
      return false;
    }

    this.validatedData = data;
    return true;
  }
}
