import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly db: DatabaseService) {}

  create(createTransactionDto: CreateTransactionDto) {
    const {userId, subProjectId, document, ...rest} = createTransactionDto;
    const doc = document as string;
    return this.db.transaction.create({
      data: {
        ...rest,
        document: doc,
        user: { connect: { id: userId } },
        subProject: { connect: { id: subProjectId } },
      }
    })
  }

  findManyByUserID(userId: number) {
    return this.db.transaction.findMany({
      where: { userId },
      include: { subProject: true, user: true }
    });
  }

  findAll() {
    return this.db.transaction.findMany({
      include: { subProject: {
        include: { block: {
          include: { project: true }
        } }
      }, user: true }
    });
  }

  findOne(id: number) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { subProject: true, user: true }
    });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const {userId, subProjectId, ...rest} = updateTransactionDto;
    return this.db.transaction.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
        subProject: subProjectId ? { connect: { id: subProjectId } } : undefined,
      }
    });
  }

  remove(id: number) {
    return this.db.transaction.delete({
      where: { id }
    });
  }
}
