import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionService {
  constructor(private readonly db: DatabaseService) {}

  create(createTransactionDto: CreateTransactionDto) {
    const {userId, presellingId, document, ...rest} = createTransactionDto;
    const doc = document as string;
    return this.db.transaction.create({
      data: {
        ...rest,
        document: doc,
        user: { connect: { id: userId } },
        preselling: { connect: { id: presellingId } },
      }
    })
  }

  findManyByUserID(userId: number) {
    return this.db.transaction.findMany({
      where: { userId },
      include: { preselling: {
        include: { project: true }
      }, user: true }
    });
  }

  findAll() {
    return this.db.transaction.findMany({
      include: { preselling: {
        include: { project: true }
      }, user: true }
    });
  }

  findOne(id: number) {
    return this.db.transaction.findUniqueOrThrow({
      where: { id },
      include: { preselling: {
        include: { project: true }
      }, user: true }
    });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const {userId, presellingId, ...rest} = updateTransactionDto;
    return this.db.transaction.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
        preselling: presellingId ? { connect: { id: presellingId } } : undefined,
      }
    });
  }

  scoreComputation(transaction: any) {
    const basePrice = 10**7;
    const today = new Date();
    const dayDiffs = Math.floor((today.getTime() - transaction.date.getTime()) / (1000 * 60 * 60 * 24)) * (transaction.isConfirmed  ? 1 : 0);
    return Number((dayDiffs * (Number(transaction?.amount) as number) / basePrice).toFixed(1));
  }

  async getScoreAll(userId?: number) {
    const transactions = await this.db.transaction.findMany(
      {
        where: {
          userId: userId? userId : undefined,
        },
        include: { preselling: {
          include: { project: true }
        }, user: true }
      }
    );
    const groupingResult = transactions.reduce((sum, transaction) =>{
      if(!sum[transaction.userId]){
        sum[transaction.userId] = {
          userInfo: transaction.user,
        };
      }
      if(!sum[transaction.userId][transaction.presellingId]){
        sum[transaction.userId][transaction.presellingId] = {
          score: 0,
          presellingInfo: transaction.preselling,
        };
      }
      sum[transaction.userId][transaction.presellingId].score += this.scoreComputation(transaction);
      return sum;
    }, {});
    return userId === undefined ? groupingResult : groupingResult[userId];
  }

  remove(id: number) {
    return this.db.transaction.delete({
      where: { id }
    });
  }
}
