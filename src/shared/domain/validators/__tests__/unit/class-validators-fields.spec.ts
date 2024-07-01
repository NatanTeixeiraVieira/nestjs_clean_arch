import { ClassValidatorsFields } from '../../class-validators-fields';
import * as classValidator from 'class-validator';

class StubClassValidatorFields extends ClassValidatorsFields<{
  field: string;
}> {}

describe('ClassValidatorFieds unit tests', () => {
  let sut: StubClassValidatorFields;
  let spyValidateSync;

  beforeEach(() => {
    sut = new StubClassValidatorFields();
    // Mock the class validator on import
    spyValidateSync = jest.spyOn(classValidator, 'validateSync');
  });

  it('should initialize errors and validated data variables with null', () => {
    expect(sut.errors).toBe(null);
    expect(sut.validatedData).toBe(null);
  });

  it('should validate with errors', () => {
    const spyValidateSync = jest.spyOn(classValidator, 'validateSync');
    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: { isRequired: 'test error' } },
    ]);

    expect(sut.validate(null)).toBeFalsy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toBe(null);
    expect(sut.errors).toStrictEqual({ field: ['test error'] });
  });

  it('should validate without errors', () => {
    const spyValidateSync = jest.spyOn(classValidator, 'validateSync');
    spyValidateSync.mockReturnValue([]);

    expect(sut.validate({ field: 'value' })).toBeTruthy();
    expect(spyValidateSync).toHaveBeenCalled();
    expect(sut.validatedData).toStrictEqual({ field: 'value' });
    expect(sut.errors).toBe(null);
  });
});
