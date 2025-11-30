import { Injectable } from '@nestjs/common';
import { CreateFinalTransactionDto } from './dto/create-final-transaction.dto';
import { UpdateFinalTransactionDto } from './dto/update-final-transaction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FinalTransactionService {
  constructor(private readonly db: DatabaseService) {}
  
  create(createTransactionDto: CreateFinalTransactionDto) {
    const {userId, subProjectId, document, ...rest} = createTransactionDto;
    const doc = document as string;
    return this.db.finalTransaction.create({
      data: {
        ...rest,
        document: doc,
        user: { connect: { id: userId } },
        subProject: { connect: { id: subProjectId } },
      }
    })
  }

  findManyByUserID(userId: number) {
    return this.db.finalTransaction.findMany({
      where: { userId },
      include: { subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }, user: true }
    });
  }

  findAll() {
    return this.db.finalTransaction.findMany({
      include: { subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }, user: true }
    });
  }

  findOne(id: number) {
    return this.db.finalTransaction.findUniqueOrThrow({
      where: { id },
      include: { subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }, user: true }
    });
  }

  update(id: number, updateFinalTransactionDto: UpdateFinalTransactionDto) {
    const {userId, subProjectId, ...rest} = updateFinalTransactionDto;
    return this.db.finalTransaction.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
        subProject: subProjectId ? { connect: { id: subProjectId } } : undefined,
      }
    });
  }

  remove(id: number) {
    return this.db.finalTransaction.delete({
      where: { id }
    });
  }
}
