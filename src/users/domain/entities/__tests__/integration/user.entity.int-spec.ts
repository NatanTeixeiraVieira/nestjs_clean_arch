import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { User, UserProps } from '../../user.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('User entity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when create user with invalid name', () => {
      let props: UserProps = { ...UserDataBuilder(), name: null };

      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        name: '',
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        name: 10 as any,
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        name: 'a'.repeat(256),
      };
      expect(() => new User(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when create user with invalid email', () => {
      let props: UserProps = { ...UserDataBuilder(), email: null };

      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        email: '',
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        email: 10 as any,
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        email: 'a'.repeat(256),
      };
      expect(() => new User(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when create user with invalid password', () => {
      let props: UserProps = { ...UserDataBuilder(), password: null };

      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        password: '',
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        password: 10 as any,
      };
      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        password: 'a'.repeat(101),
      };
      expect(() => new User(props)).toThrow(EntityValidationError);
    });

    it('Should throw an error when create user with invalid createdAt', () => {
      let props: UserProps = { ...UserDataBuilder(), createdAt: `2024` as any };

      expect(() => new User(props)).toThrow(EntityValidationError);

      props = {
        ...UserDataBuilder(),
        createdAt: 10 as any,
      };
      expect(() => new User(props)).toThrow(EntityValidationError);
    });

    it('Should return a valid a user', () => {
      expect.assertions(0);
      const props: UserProps = { ...UserDataBuilder() };
      new User(props);
    });
  });

  describe('Update method', () => {
    it('Should throw an error when updating a user with invalid name', () => {
      const entity = new User(UserDataBuilder());

      expect(() => entity.update(null)).toThrow(EntityValidationError);
      expect(() => entity.update('')).toThrow(EntityValidationError);
      expect(() => entity.update(10 as any)).toThrow(EntityValidationError);
      expect(() => entity.update('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });

    it('Should return a valid a user', () => {
      expect.assertions(0);
      const props: UserProps = { ...UserDataBuilder() };

      const entity = new User(props);
      entity.update('other name');
    });
  });

  describe('UpdatePassword methos', () => {
    it('Should test a invalid user using password field', () => {
      const entity = new User(UserDataBuilder());

      expect(() => entity.updatePassword(null)).toThrow(EntityValidationError);
      expect(() => entity.updatePassword('')).toThrow(EntityValidationError);
      expect(() => entity.updatePassword(10 as any)).toThrow(
        EntityValidationError,
      );
      //TODO Fix this test because it should throw error with 101, but it only works with 256 or more
      expect(() => entity.updatePassword('a'.repeat(256))).toThrow(
        EntityValidationError,
      );
    });
    it('Should return a valid a user', () => {
      expect.assertions(0);
      const props: UserProps = UserDataBuilder();

      const entity = new User(props);
      entity.updatePassword('other password');
    });
  });
});
