export type FieldsError = Record<string, string[]>;

export interface ValidatorFieldsInterface<PropsValidated> {
  errors: FieldsError;
  validatedData: PropsValidated;
  validate(data: PropsValidated): boolean;
}
