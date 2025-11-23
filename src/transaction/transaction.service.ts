import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly db: DatabaseService) {}

  create(createTransactionDto: CreateTransactionDto) {
    const {userId, projectId, document, ...rest} = createTransactionDto;
    const doc = document as string;
    return this.db.transaction.create({
      data: {
        ...rest,
        document: doc,
        user: { connect: { id: userId } },
        project: { connect: { id: projectId } },
      }
    })
  }

  findManyByUserID(userId: number) {
    return this.db.transaction.findMany({
      where: { userId },
      include: { project: true, user: true }
    });
  }

  findAll() {
    return this.db.transaction.findMany({
      include: { project: true, user: true }
    });
  }

  findOne(id: number) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { project: true, user: true }
    });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const {userId, projectId, ...rest} = updateTransactionDto;
    return this.db.transaction.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
        project: projectId ? { connect: { id: projectId } } : undefined,
      }
    });
  }

  remove(id: number) {
    return this.db.transaction.delete({
      where: { id }
    });
  }
}
