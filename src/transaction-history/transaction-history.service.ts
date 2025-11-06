import { Injectable } from '@nestjs/common';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TransactionHistoryService {
  constructor(private readonly db: DatabaseService) {}
  create(createTransactionHistoryDto: CreateTransactionHistoryDto) {
    const {userId, subProjectId} = createTransactionHistoryDto;
    return this.db.transactionHistory.create({
      data: {
        user: { connect: { id: userId } },
        subProject: { connect: { id: subProjectId } },
    }})
  }

  findManyByUserID(id: number) {
    return this.db.transactionHistory.findMany({
      where: { userId: id },
      include: { subProject: {
        include: { block: { include: { project: true } } }
      }, user: true }
    });
  }

  findManyBySubProjectID(id: number) {
    return this.db.transactionHistory.findMany({
      where: { subProjectId: id },
      include: { subProject: {
        include: { block: { include: { project: true } } }
      }, user: true }
    });
  }

}
