import { Module } from '@nestjs/common';
import { FinalTransactionService } from './final-transaction.service';
import { FinalTransactionController } from './final-transaction.controller';

@Module({
  controllers: [FinalTransactionController],
  providers: [FinalTransactionService],
})
export class FinalTransactionModule {}
