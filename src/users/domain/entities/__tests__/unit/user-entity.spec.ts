import { User, UserProps } from '../../user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: User;

  beforeEach(() => {
    User.validate = jest.fn();
    props = UserDataBuilder();
    sut = new User(props);
  });

  it('should work constructor method', () => {
    expect(User.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should get name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('should set name field', () => {
    sut['name'] = 'other name';
    expect(sut.props.name).toEqual('other name');
    expect(typeof sut.props.name).toEqual('string');
  });

  it('should get email field', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('should get password field', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('should set password field', () => {
    sut['password'] = 'other password';
    expect(sut.props.password).toEqual('other password');
    expect(typeof sut.props.password).toEqual('string');
  });

  it('should get createdAt field', () => {
    expect(sut.createdAt).toBeDefined();
    expect(sut.createdAt).toBeInstanceOf(Date);
  });

  it('should update user name', () => {
    sut.update('other name');
    expect(User.validate).toHaveBeenCalled();
    expect(sut.props.name).toEqual('other name');
  });

  it('should update user password', () => {
    sut.updatePassword('other password');
    expect(User.validate).toHaveBeenCalled();
    expect(sut.props.password).toEqual('other password');
  });
});
