import { faker } from '@faker-js/faker';
import { User, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: User;

  beforeEach(() => {
    props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    sut = new User(props);
  });

  it('should work constructor method', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should get name field', () => {
    expect(sut.props.name).toBeDefined();
    expect(sut.props.name).toEqual(props.name);
    expect(typeof sut.props.name).toBe('string');
  });

  it('should set name field', () => {
    sut['name'] = 'other name';
    expect(sut.props.name).toEqual('other name');
    expect(typeof sut.props.name).toEqual('string');
  });

  it('should get email field', () => {
    expect(sut.props.email).toBeDefined();
    expect(sut.props.email).toEqual(props.email);
    expect(typeof sut.props.email).toBe('string');
  });

  it('should get password field', () => {
    expect(sut.props.password).toBeDefined();
    expect(sut.props.password).toEqual(props.password);
    expect(typeof sut.props.password).toBe('string');
  });

  it('should set password field', () => {
    sut['password'] = 'other password';
    expect(sut.props.password).toEqual('other password');
    expect(typeof sut.props.password).toEqual('string');
  });

  it('should get createdAt field', () => {
    expect(sut.props.createdAt).toBeDefined();
    expect(sut.props.createdAt).toBeInstanceOf(Date);
  });

  it('should update user name', () => {
    sut.update('other name');
    expect(sut.props.name).toEqual('other name');
  });

  it('should update user password', () => {
    sut.updatePassword('other password');
    expect(sut.props.password).toEqual('other password');
  });
});
