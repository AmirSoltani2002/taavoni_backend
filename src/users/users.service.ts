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
    const userNational = await this.findOneByNationalNumber(createUser.nationalNumber);
    const userEmail = await this.findOneByEmail(createUser.email);
    if (userEmail !== null || userNational !== null) {
      throw new ConflictException();
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
      where: { id }
    });
  }

  async findOneByNationalNumber(nationalNumber: string) {
    return this.db.userinfo.findUnique({
      where: { nationalNumber },
    });
  }

  async findOneByEmail(email: string | undefined | null) {
    if(!email) return null;
    return this.db.userinfo.findFirst({
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
