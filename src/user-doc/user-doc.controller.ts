import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserDocService } from './user-doc.service';
import { CreateUserDocDto } from './dto/create-user-doc.dto';
import { UpdateUserDocDto } from './dto/update-user-doc.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import type { Request as ExpressRequest, Response } from 'express';

const uploadPath = './uploads/userdocs/';
const ADMIN_TYPES = new Set(['admin', 'system']);

type Account = {
  id: number;
  type?: string | null;
};

type AuthenticatedRequest = ExpressRequest & {
  user: Account;
};

@Controller('user-doc')
export class UserDocController {
  constructor(
    private readonly userDocService: UserDocService,
    private readonly usersService: UsersService,
  ) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  private assertDocumentAccess(
    actor: Account,
    owner: Account,
    detail?: string | null,
  ) {
    const isOwner = +actor.id === owner.id;
    const isAdminManagingInvestor =
      ADMIN_TYPES.has(actor.type ?? '') &&
      (detail === 'profile-image' || !ADMIN_TYPES.has(owner.type ?? ''));

    if (!isOwner && !isAdminManagingInvestor) {
      throw new ForbiddenException(
        'You do not have access to this user document',
      );
    }
  }

  private discardUploadedFile(file?: Express.Multer.File) {
    if (file?.path) {
      fs.unlink(file.path, () => undefined);
    }
  }

  @UseInterceptors()
  @Get('profile')
  findMy(
    @Request() req: AuthenticatedRequest,
    @Query('detail') detail?: string,
  ) {
    return this.userDocService.findAllByUser(+req.user.id, detail);
  }

  @Get('download/:fileId')
  async downloadFile(
    @Param('fileId') fileId: number,
    @Request() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const fileDoc = await this.userDocService.findOne(+fileId);
    if (fileDoc.detail !== 'profile-image') {
      this.assertDocumentAccess(req.user, fileDoc.user, fileDoc.detail);
    }
    const filePath = path.join(uploadPath, fileDoc.document);
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send('File not found');
      }
    });
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
  async create(
    @Body() createUserDocDto: CreateUserDocDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: AuthenticatedRequest,
  ) {
    if (!file) throw new BadRequestException('No File is Sent');
    createUserDocDto.document = `${file?.filename}`;
    try {
      const owner = await this.usersService.findOne(createUserDocDto.userId);
      if (!owner) {
        throw new NotFoundException('User is not found');
      }
      this.assertDocumentAccess(req.user, owner, createUserDocDto.detail);
      return await this.userDocService.create(createUserDocDto);
    } catch (error) {
      this.discardUploadedFile(file);
      throw error;
    }
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
  async update(
    @Param('id') id: string,
    @Body() updateUserDocDto: UpdateUserDocDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const existingDocument = await this.userDocService.findOne(+id);
      this.assertDocumentAccess(
        req.user,
        existingDocument.user,
        existingDocument.detail,
      );
      if (
        updateUserDocDto.userId !== undefined &&
        updateUserDocDto.userId !== existingDocument.userId
      ) {
        throw new BadRequestException('Document ownership cannot be changed');
      }
      if (file) {
        updateUserDocDto.document = `${file?.filename}`;
      }
      return await this.userDocService.update(+id, updateUserDocDto);
    } catch (error) {
      this.discardUploadedFile(file);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req: AuthenticatedRequest) {
    const existingDocument = await this.userDocService.findOne(+id);
    this.assertDocumentAccess(
      req.user,
      existingDocument.user,
      existingDocument.detail,
    );
    return this.userDocService.remove(+id);
  }
}
