import { Module } from '@nestjs/common';
import { SubprojectsService } from './subprojects.service';
import { SubprojectsController } from './subprojects.controller';
import { TransactionHistoryModule } from 'src/transaction-history/transaction-history.module';

@Module({
  imports: [TransactionHistoryModule],
  controllers: [SubprojectsController],
  providers: [SubprojectsService],
  exports: [SubprojectsService],
})
export class SubprojectsModule {}
