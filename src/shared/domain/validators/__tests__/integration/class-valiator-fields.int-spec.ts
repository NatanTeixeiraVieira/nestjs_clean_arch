import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { ClassValidatorsFields } from '../../class-validators-fields';

type Data = {
  name: string;
  price: number;
};

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  constructor(data: Data) {
    Object.assign(this, data);
  }
}

class StubClassValidatorFields extends ClassValidatorsFields<StubRules> {
  validate(data: StubRules): boolean {
    return super.validate(new StubRules(data));
  }
}

describe('ClassValidatorFields integration tests', () => {
  it('Shouls validate with errors', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.validate(null)).toBeFalsy();
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    });
  });

  it('Shouls validate without errors', () => {
    const validator = new StubClassValidatorFields();
    expect(validator.validate({ name: 'Name', price: 1 })).toBeTruthy();
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'Name', price: 1 }),
    );
  });
});
