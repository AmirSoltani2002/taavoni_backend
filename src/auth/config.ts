import * as bcrypt from 'bcrypt';

export class PasswordService {
  private static readonly saltRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  static async compare(userPassword, inputPassword) {
    return bcrypt.compare(inputPassword, userPassword);
  }
}
