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
import { ProjectDocsService } from './project-docs.service';
import { CreateProjectDocDto } from './dto/create-project-doc.dto';
import { UpdateProjectDocDto } from './dto/update-project-doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';
import type { Response } from 'express';

const uploadPath = path.join(process.cwd(), 'uploads', 'projectdocs');
@Roles(['admin', 'system'])
@Controller('project-docs')
export class ProjectDocsController {
  constructor(private readonly projectDocsService: ProjectDocsService) {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }

  /**
   * Create a new Project Document with file upload
   */
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
  async create(
    @Body() createProjectDocDto: CreateProjectDocDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No File is Sent');
    }
    createProjectDocDto.document = `${file.filename}`;
    try {
      const res = await this.projectDocsService.create(createProjectDocDto);
      return res;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to create Project Document');
    }
  }

  /**
   * Get all Project Documents
   */

  @Roles(['admin', 'system', 'free', 'tehranUni', 'otherUni', 'employee'])
  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: number, @Res() res: Response) {
    console.log('Downloading file with id:', fileId);
    const fileDoc = await this.projectDocsService.findOne(fileId);
    const filePath = path.join(uploadPath, fileDoc.document);
    res.download(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(404).send('File not found');
      }
    });
  }
  
  @Get()
  findAll(@Query('detail') detail?: string) {
    return this.projectDocsService.findAll(detail);
  }

  /**
   * Get a single Project Document by ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDocsService.findOne(+id);
  }

  /**
   * Get all documents for a specific Project
   */
  @Get('project/:id')
  findAllByProject(@Param('id') id: string, @Query('detail') detail?: string) {
    return this.projectDocsService.findAllByProject(+id, detail);
  }

  /**
   * Update a Project Document
   * Optional: Update file
   */
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
        callback(null, true);
      },
    }),
  )
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDocDto: UpdateProjectDocDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProjectDocDto.document = `${file.filename}`;
    }
    const res = this.projectDocsService.update(+id, updateProjectDocDto);
    try {
      return await res;
    } catch (error) {
      throw new BadRequestException('Failed to update Project Document');
    }
  }

  /**
   * Delete a Project Document
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDocsService.remove(+id);
  }


}
