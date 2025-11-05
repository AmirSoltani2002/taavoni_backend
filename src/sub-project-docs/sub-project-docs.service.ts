import { Injectable } from '@nestjs/common';
import { CreateSubProjectDocDto } from './dto/create-sub-project-doc.dto';
import { UpdateSubProjectDocDto } from './dto/update-sub-project-doc.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubProjectDocsService {
  constructor(private readonly db: DatabaseService){}

  create(createSubProjectDocDto: CreateSubProjectDocDto) {
    const {subProjectId, document, detail} = createSubProjectDocDto;
    return this.db.subProjectDoc.create({
      data: {
        subProject: { connect: { id: subProjectId } },
        document: document as string,
        detail
      }
    })
  }

  findAll(detail?: string) {
    return this.db.subProjectDoc.findMany({
      where: {
        ...(detail ? { detail: { contains: detail } } : {})
      }
    });
  }

  findAllBySubProject(id: number, detail?: string){
    return this.db.subProjectDoc.findMany({
      where: {
        subProjectId: id,
        ...(detail ? { detail: { contains: detail } } : {})
      }
    });
  }

  findOne(id: number) {
    return this.db.subProjectDoc.findUniqueOrThrow({
      where: { id }
    });
  }

  update(id: number, updateSubProjectDocDto: UpdateSubProjectDocDto) {
    return this.db.subProjectDoc.update({
      where: { id },
      data: updateSubProjectDocDto
    });
  }

  remove(id: number) {
    return this.db.subProjectDoc.delete({ where: { id } });
  }
}
