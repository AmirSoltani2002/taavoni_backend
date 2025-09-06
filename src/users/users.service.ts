import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUser: Prisma.userinfoCreateInput) {
    const user = await this.findOneByNationalNumber(createUser.nationalNumber);
    if (user !== null) {
      throw new ConflictException(
        'User with this national number already exists',
      );
    }
    return this.db.userinfo.create({
      data: createUser,
    });
  }

  async findAll() {
    return this.db.userinfo.findMany();
  }

  async findOne(id: number) {
    return this.db.userinfo.findUnique({
      where: { id },
    });
  }

  async findOneByNationalNumber(nationalNumber: string) {
    return this.db.userinfo.findUnique({
      where: { nationalNumber },
    });
  }

  async findOneByEmail(email: string) {
    return this.db.userinfo.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUser: Prisma.userinfoUpdateInput) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException();
    return this.db.userinfo.update({
      where: { id },
      data: updateUser,
    });
  }

  async remove(id: number) {
    return this.db.userinfo.delete({
      where: { id },
    });
  }
}
