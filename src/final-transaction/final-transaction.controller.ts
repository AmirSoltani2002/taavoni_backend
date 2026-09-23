import { Controller, Get, Post, Body, Patch, Request, Param, Delete, UseInterceptors, UnauthorizedException, BadRequestException, UploadedFile, Res } from '@nestjs/common';
import { FinalTransactionService } from './final-transaction.service';
import { CreateFinalTransactionDto } from './dto/create-final-transaction.dto';
import { UpdateFinalTransactionDto } from './dto/update-final-transaction.dto';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/roles.decorator';
import {
  preventClearingTransactionPaymentDetails,
  requireTransactionPaymentDetails,
} from 'src/common/transaction-payment-details';

const uploadPath = path.join(process.cwd(), 'uploads', 'final-transaction');

async function removeUploadedDocument(filename?: string) {
  if (!filename) return;
  try {
    await fs.promises.unlink(path.join(uploadPath, path.basename(filename)));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Unable to remove final transaction document', error);
    }
  }
}

@Controller('final-transaction')
export class FinalTransactionController {
  constructor(private readonly transactionService: FinalTransactionService) {
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
  create(@Body() createFinalTransactionDto: CreateFinalTransactionDto, @Request() req, @UploadedFile() file: Express.Multer.File) {
    const canLeavePaymentDetailsEmpty = ['admin', 'system'].includes(req['user'].type);
    if (file) {
      createFinalTransactionDto.document = `${file.filename}`;
    }
    if(!canLeavePaymentDetailsEmpty){
      createFinalTransactionDto.userId = req['user'].id;
      requireTransactionPaymentDetails(createFinalTransactionDto);
    }
    if(createFinalTransactionDto?.isConfirmed !== undefined && !canLeavePaymentDetailsEmpty){
      throw new UnauthorizedException("Only admin or system can change confirmation status");
    }
    return this.transactionService.create(createFinalTransactionDto);
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response, @Request() req) {
    const transaction = await this.transactionService.findOne(fileId);
    if(!transaction?.document){
      throw new BadRequestException("No document uploaded for this transaction");
    }
    const filePath = path.join(uploadPath, transaction?.document);
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
  async update(@Param('id') id: string, @Body() updateFinalTransactionDto: UpdateFinalTransactionDto, @Request() req, @UploadedFile() file?: Express.Multer.File) {
    if (file && updateFinalTransactionDto.removeDocument) {
      await removeUploadedDocument(file.filename);
      throw new BadRequestException('A document cannot be replaced and removed at the same time');
    }
    if (file) {
      updateFinalTransactionDto.document = `${file.filename}`;
    }
    const existingFile = await this.transactionService.findOne(+id);
    const userId = existingFile.userId;
    if(!['admin', 'system'].includes(req['user'].type) && req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    if(updateFinalTransactionDto?.isConfirmed !== undefined && !['admin', 'system'].includes(req['user'].type)){
      throw new UnauthorizedException("Only admin or system can change confirmation status");
    }
    if(updateFinalTransactionDto.userId && !['admin', 'system'].includes(req['user'].type)){
      updateFinalTransactionDto.userId = req['user'].id;
    }
    if(!['admin', 'system'].includes(req['user'].type)){
      preventClearingTransactionPaymentDetails(updateFinalTransactionDto);
    }
    try {
      const updatedTransaction = await this.transactionService.update(+id, updateFinalTransactionDto);
      if ((file || updateFinalTransactionDto.removeDocument) && existingFile.document) {
        await removeUploadedDocument(existingFile.document);
      }
      return updatedTransaction;
    } catch (error) {
      if (file) {
        await removeUploadedDocument(file.filename);
      }
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const file = await this.transactionService.findOne(+id);
    const userId = file.userId;
    if(!['admin', 'system'].includes(req['user'].type) && req['user'].id !== userId){
      throw new UnauthorizedException();
    }
    return this.transactionService.remove(+id);
  }
}
