import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Roles } from 'src/auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

const uploadPath = path.join(process.cwd(), 'uploads', 'invoices');
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file || !file.originalname) {
          return callback(new Error('Invalid file'), false);
        }
        callback(null, true);
      },
    }),
  )
  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
    if(!file){
      throw new UnauthorizedException('No File is Sent');
    }
    createInvoiceDto.document = `${file.filename}`;
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

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadPath,
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file || !file.originalname) {
          return callback(new Error('Invalid file'), false);
        }
        callback(null, true);
      },
    }),
  )
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @Request() req, @UploadedFile() file?: Express.Multer.File) {
    if(file){
      updateInvoiceDto.document = `${file.filename}`;
    }
    const fileExists = await this.invoiceService.findOne(+id);
    const userId = fileExists.userId;
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
