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
      throw new ConflictException(
        'User with this nationalNumber or Email already exists',
      );
    }
    return this.db.userinfo.create({
      data: createUser,
    });
  }

  async findAll() {
    return this.db.userinfo.findMany({
      include: {subProjects: true}
    });
  }

  async findOne(id: number) {
    return this.db.userinfo.findUnique({
      where: { id },
      include: {subProjects: true}
    });
  }

  async findOneByNationalNumber(nationalNumber: string) {
    return this.db.userinfo.findUnique({
      where: { nationalNumber },
      include: {subProjects: true}
    });
  }

  async findOneByEmail(email: string) {
    return this.db.userinfo.findUnique({
      where: { email },
      include: {subProjects: true}
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
