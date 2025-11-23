import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Res, UnauthorizedException, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Roles } from 'src/auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

const uploadPath = path.join(process.cwd(), 'uploads', 'transaction');
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {
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
  create(@Body() createTransactionDto: CreateTransactionDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
    if (file) {
      createTransactionDto.document = `${file.filename}`;
    }
    if(!['admin', 'system'].includes(req['user'].type)){
      createTransactionDto.userId = req['user'].id;
    }
    return this.transactionService.create(createTransactionDto);
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response, @Request() req) {
    const transaction = await this.transactionService.findOne(fileId);
    const filePath = path.join(uploadPath, transaction.document);
    if(req['user'].id !== transaction.userId && !['admin', 'system'].includes(req['user'].type)){
      throw new BadRequestException("You can only upload document for yourself");
    }
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send('File not found');
      }
    });
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
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Request() req, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      updateTransactionDto.document = `${file.filename}`;
    }
    const existingFile = await this.transactionService.findOne(+id);
    const userId = existingFile.userId;
    if(!['admin', 'system'].includes(req['user'].type) && req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    if(updateTransactionDto?.isConfirmed !== undefined && !['admin', 'system'].includes(req['user'].type)){
      throw new UnauthorizedException("Only admin or system can change confirmation status");
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
