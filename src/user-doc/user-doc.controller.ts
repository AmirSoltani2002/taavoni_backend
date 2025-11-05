import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseInterceptors, BadRequestException, UploadedFile, Query, Res} from '@nestjs/common';
import { UserDocService } from './user-doc.service';
import { CreateUserDocDto } from './dto/create-user-doc.dto';
import { UpdateUserDocDto } from './dto/update-user-doc.dto';
import { Roles } from 'src/auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import type {Response} from "express";

const uploadPath = './uploads/userdocs/';
@Controller('user-doc')
export class UserDocController {
  constructor(private readonly userDocService: UserDocService) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  @UseInterceptors()
  @Get('profile')
  findMy(@Request() req, @Query('detail') detail?: string) {
    return this.userDocService.findAllByUser(+req['user'].id, detail);
  }

  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: uploadPath,
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}-${file.originalname}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          callback(null, true);
        },
      }),
  )
  @Patch('profile')
  updateMy(
    detail: string,
    @Body() updateUserDocDto: UpdateUserDocDto,
    @Request() req,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if(file){
      updateUserDocDto.document = `/uploads/userdocs/${file?.filename}`;
    }
    return this.userDocService.updateByUser(+req['user'].id, updateUserDocDto, detail);
  }

  @Delete('profile')
  removeMy(detail: string, @Request() req) {
    return this.userDocService.removeByUser(+req['user'].id, detail);
  }

  @Roles(['admin', 'system'])
  @Get('user/:id')
  findAllByUser(@Param('id') id: string, @Query('detail') detail?: string) {
    return this.userDocService.findAllByUser(+id, detail);
  }

  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads/userdocs/',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}-${file.originalname}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          callback(null, true);
        },
      }),
  )
  @Post()
  create(
    @Body() createUserDocDto: CreateUserDocDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
) {
    if(!file)
      throw new BadRequestException("No File is Sent");
    createUserDocDto.document = `/uploads/userdocs/${file?.filename}`;
    if(req['user'].id !== createUserDocDto.userId && !['admin', 'system'].includes(req['user'].type)){
      throw new BadRequestException("You can only upload document for yourself");
    }
    return this.userDocService.create(createUserDocDto);
  }

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response, @Request() req) {
    const createUserDocDto = await this.userDocService.findOne(fileId);
    const filePath = path.join(uploadPath, createUserDocDto.document);
    if(req['user'].id !== createUserDocDto.userId && !['admin', 'system'].includes(req['user'].type)){
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
  @Get()
  findAll(@Query('detail') detail?: string) {
    return this.userDocService.findAll(detail);
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userDocService.findOne(+id);
  }

  @Roles(['admin', 'system'])
  @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: uploadPath,
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${uniqueSuffix}-${file.originalname}`);
          },
        }),
        fileFilter: (req, file, callback) => {
          callback(null, true);
        },
      }),
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDocDto: UpdateUserDocDto, @UploadedFile() file?: Express.Multer.File) {
    if(file){
      updateUserDocDto.document = `/uploads/userdocs/${file?.filename}`;
    }
    return this.userDocService.update(+id, updateUserDocDto);
  }

  @Roles(['admin', 'system'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userDocService.remove(+id);
  }
}
