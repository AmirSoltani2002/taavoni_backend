import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req) {
    if(!['admin', 'system'].includes(req['user'].type)){
      createInvoiceDto.userId = req['user'].id;
    }
    return this.invoiceService.create(createInvoiceDto);
  }

  @Roles(['admin', 'system'])
  @Get('users/:id')
  findProfile(@Param('id') id: number) {
    return this.invoiceService.findManyByUserID(id);
  }

  @Get('profile')
  findByUser(@Request() req) {
    return this.invoiceService.findManyByUserID(req['user'].id);
  }

  @Roles(['admin', 'system'])
  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @Request() req) {
    const file = await this.invoiceService.findOne(+id);
    const userId = file.userId;
    if(!['admin', 'system'].includes(req['user'].type) || req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    if(updateInvoiceDto.userId && !['admin', 'system'].includes(req['user'].type)){
      updateInvoiceDto.userId = req['user'].id;
    }
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const file = await this.invoiceService.findOne(+id);
    const userId = file.userId;
    if(!['admin', 'system'].includes(req['user'].type) || req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    return this.invoiceService.remove(+id);
  }
}
