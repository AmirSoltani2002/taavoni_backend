import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(createUser: Prisma.userinfoCreateInput) {
    const user = this.findOneByNationalNumber(createUser.nationalNumber);
    if (user !== null) {
      return new ConflictException('User with this national number already exists');
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

  async update(id: number, updateUser: Prisma.userinfoUpdateInput) {
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
