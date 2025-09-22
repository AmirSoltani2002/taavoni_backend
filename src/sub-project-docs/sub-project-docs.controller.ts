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
import { SubProjectDocsService } from './sub-project-docs.service';
import { CreateSubProjectDocDto } from './dto/create-sub-project-doc.dto';
import { UpdateSubProjectDocDto } from './dto/update-sub-project-doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Roles } from 'src/auth/roles.decorator';

@Controller('sub-project-docs')
export class SubProjectDocsController {
  constructor(private readonly subProjectDocsService: SubProjectDocsService) {}

  /**
   * Create SubProjectDoc with File Upload
   */
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/subprojectdocs/',
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

  /**
   * Get all SubProjectDocs
   */
  @Roles(['admin', 'system'])
  @Get()
  findAll(@Query('detail') detail?: string) {
    return this.subProjectDocsService.findAll(detail);
  }

  /**
   * Get a single SubProjectDoc by ID
   */
  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subProjectDocsService.findOne(+id);
  }

  /**
   * Get all SubProjectDocs for a specific SubProject
   */
  @Roles(['admin', 'system'])
  @Get('subproject/:id')
  findAllBySubProject(@Param('id') id: string, @Query('detail') detail?: string) {
    return this.subProjectDocsService.findAllBySubProject(+id, detail);
  }

  /**
   * Update SubProjectDoc with optional file
   */
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/subprojectdocs/',
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
  @Roles(['admin', 'system'])
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
  @Roles(['admin', 'system'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subProjectDocsService.remove(+id);
  }
}
