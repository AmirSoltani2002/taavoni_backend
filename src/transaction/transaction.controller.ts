import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Req, UnauthorizedException } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req) {
    if(!['admin', 'system'].includes(req['user'].type)){
      createTransactionDto.userId = req['user'].id;
    }
    return this.transactionService.create(createTransactionDto);
  }

  @Roles(['admin', 'system'])
  @Get('users/:id')
  findProfile(@Param('id') id: number) {
    return this.transactionService.findManyByUserID(id);
  }

  @Get('profile')
  findByUser(@Request() req) {
    return this.transactionService.findManyByUserID(req['user'].id);
  }

  @Roles(['admin', 'system'])
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() req) {
    const file = await this.transactionService.findOne(+id);
    const userId = file.userId;
    if(!['admin', 'system'].includes(req['user'].type) || req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    if(updateTransactionDto.userId && !['admin', 'system'].includes(req['user'].type)){
      updateTransactionDto.userId = req['user'].id;
    }
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const file = await this.transactionService.findOne(+id);
    const userId = file.userId;
    if(!['admin', 'system'].includes(req['user'].type) || req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    return this.transactionService.remove(+id);
  }
}
