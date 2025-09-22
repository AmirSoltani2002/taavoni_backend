import { Injectable, UseInterceptors } from '@nestjs/common';
import { CreateProjectDocDto } from './dto/create-project-doc.dto';
import { UpdateProjectDocDto } from './dto/update-project-doc.dto';
import { DatabaseService } from 'src/database/database.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class ProjectDocsService {
  constructor(private readonly db: DatabaseService){}

  create(createProjectDocDto: CreateProjectDocDto) {
    const {projectId, document, detail} = createProjectDocDto;
    return this.db.projectDoc.create({ data: { project: { connect: { id: projectId } }, document: document as string, detail } });
  }

  findAll(detail?: string) {
    return this.db.projectDoc.findMany({
      where: {
        ...(detail ? { detail: { contains: detail } } : {})
      }
    });
  }

  findAllByProject(id: number, detail?: string){
    return this.db.projectDoc.findMany({
      where: {
        projectId: id,
        ...(detail ? { detail: { contains: detail } } : {})
      }
    });
  }

  findOne(id: number) {
    return this.db.projectDoc.findUnique({ where: { id } });
  }

  update(id: number, updateProjectDocDto: UpdateProjectDocDto) {
    return this.db.projectDoc.update({
      where: { id },
      data: updateProjectDocDto
    });
  }

  remove(id: number) {
    return this.db.projectDoc.delete({ where: { id } });
  }
}
