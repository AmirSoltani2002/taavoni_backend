import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { SubProjectDocsService } from './sub-project-docs.service';
import { CreateSubProjectDocDto } from './dto/create-sub-project-doc.dto';
import { UpdateSubProjectDocDto } from './dto/update-sub-project-doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';

const uploadPath = './uploads/subprojectdocs/';
@Roles(['admin', 'system'])
@Controller('sub-project-docs')
export class SubProjectDocsController {
  constructor(private readonly subProjectDocsService: SubProjectDocsService) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  /**
   * Create SubProjectDoc with File Upload
   */
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
  @Post()
  create(
    @Body() createSubProjectDocDto: CreateSubProjectDocDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No File is Sent');
    }
    createSubProjectDocDto.document= `/uploads/subprojectdocs/${file.filename}`;
    return this.subProjectDocsService.create(createSubProjectDocDto);
  }

  @Roles(['admin', 'system', 'free', 'tehranUni', 'otherUni', 'employee'])
  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response) {
    const subProjectDoc = await this.subProjectDocsService.findOne(fileId);
    const filePath = path.join(uploadPath, subProjectDoc.document);
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send('File not found');
      }
    });
  }

  @Get('subproject/:id')
  findAllBySubProject(@Param('id') id: string, @Query('detail') detail?: string) {
    return this.subProjectDocsService.findAllBySubProject(+id, detail);
  }
  /**
   * Get all SubProjectDocs
   */

  @Get()
  findAll(@Query('detail') detail?: string) {
    return this.subProjectDocsService.findAll(detail);
  }

  /**
   * Get a single SubProjectDoc by ID
   */

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subProjectDocsService.findOne(+id);
  }

  /**
   * Get all SubProjectDocs for a specific SubProject
   */

  /**
   * Update SubProjectDoc with optional file
   */
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
  update(
    @Param('id') id: string,
    @Body() updateSubProjectDocDto: UpdateSubProjectDocDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateSubProjectDocDto.document = `/uploads/subprojectdocs/${file.filename}`;
    }
    return this.subProjectDocsService.update(+id, updateSubProjectDocDto);
  }

  /**
   * Delete SubProjectDoc by ID
   */

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subProjectDocsService.remove(+id);
  }

  
}
