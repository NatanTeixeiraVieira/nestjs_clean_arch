export class InvalidCredentilsError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'InvalidCredentilsError';
  }
}
