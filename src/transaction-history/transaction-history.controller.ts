import { Controller, Get, Param, Request } from '@nestjs/common';
import { TransactionHistoryService } from './transaction-history.service';
import { CreateTransactionHistoryDto } from './dto/create-transaction-history.dto';
import { UpdateTransactionHistoryDto } from './dto/update-transaction-history.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('transaction-history')
export class TransactionHistoryController {
  constructor(private readonly transactionHistoryService: TransactionHistoryService) {}

  @Roles(['admin', 'system'])
  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.transactionHistoryService.findManyByUserID(+id);
  }

  @Get('profile')
  findMy(@Request() req) {
    return this.transactionHistoryService.findManyByUserID(req['user'].id);
  }

  @Roles(['admin', 'system'])
  @Get('subProject/:id')
  findAll(@Param('id') id: string) {
    return this.transactionHistoryService.findManyBySubProjectID(+id);
  }
}
