import { User, UserProps } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: User;

  beforeEach(() => {
    props = UserDataBuilder();

    sut = new User(props, 1);
  });

  it('Should work with constructor method', () => {
    expect(sut.props.name).toBe(props.name);
    expect(sut.props.email).toBe(props.email);
    expect(sut.props.password).toBe(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('Should get the name field with getter', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Should set the name field with setter', () => {
    sut['name'] = 'other name';
    expect(sut.props.name).toBe('other name');
  });

  it('Should get the email field with getter', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('Should get the password field with getter', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('Should set the password field with setter', () => {
    sut['password'] = 'other password';
    expect(sut.password).toBe('other password');
    expect(typeof sut.password).toBe('string');
  });

  it('Should get the createdAt field with getter', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('Should update the user name', () => {
    sut.update('other name');
    expect(sut.props.name).toBe('other name');
  });

  it('Should update the user password', () => {
    sut.updatePassword('other password');
    expect(sut.props.password).toBe('other password');
  });
});
