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
} from '@nestjs/common';
import { ProjectDocsService } from './project-docs.service';
import { CreateProjectDocDto } from './dto/create-project-doc.dto';
import { UpdateProjectDocDto } from './dto/update-project-doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/roles.decorator';
import * as fs from 'fs';

const uploadPath = './uploads/projectdocs/';
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
    const res =  this.projectDocsService.create(createProjectDocDto);
    try {
      return await res;
    } catch (error) {
      throw new BadRequestException('Failed to create Project Document');
    }
  }

  /**
   * Get all Project Documents
   */
  @Roles(['admin', 'system'])
  @Get()
  findAll(@Query('detail') detail?: string) {
    return this.projectDocsService.findAll(detail);
  }

  /**
   * Get a single Project Document by ID
   */
  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDocsService.findOne(+id);
  }

  /**
   * Get all documents for a specific Project
   */
  @Roles(['admin', 'system'])
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
  @Roles(['admin', 'system'])
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDocDto: UpdateProjectDocDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProjectDocDto.document = `/uploads/projectdocs/${file.filename}`;
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
  @Roles(['admin', 'system'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDocsService.remove(+id);
  }
}
