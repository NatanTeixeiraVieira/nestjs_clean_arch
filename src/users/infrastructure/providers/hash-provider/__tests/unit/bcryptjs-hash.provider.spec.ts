import { BcryptHashProvider } from '../../bcryptjs-hash.provider';

describe('BcryptHashProvider unit tests', () => {
  let sut: BcryptHashProvider;

  beforeEach(() => {
    sut = new BcryptHashProvider();
  });

  it('should return a encrypted password', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);
    expect(hash).toBeDefined();
  });

  it('should return false on invalid password and hash comparison', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash('fake', hash);
    expect(result).toBeFalsy();
  });

  it('should return true on invalid password and hash comparison', async () => {
    const password = 'TestPassword123';
    const hash = await sut.generateHash(password);
    const result = await sut.compareHash(password, hash);
    expect(result).toBeTruthy();
  });
});
