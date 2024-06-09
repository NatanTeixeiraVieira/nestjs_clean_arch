export class NotFountError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'NotFountError';
  }
}
