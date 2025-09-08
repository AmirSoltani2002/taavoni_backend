import { Injectable } from '@nestjs/common';
import { CreateSubprojectDto } from './dto/create-subproject.dto';
import { UpdateSubprojectDto } from './dto/update-subproject.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubprojectsService {
  constructor(private readonly db: DatabaseService) {}
  
  create(createSubproject: CreateSubprojectDto) {
    return this.db.subProject.create({
      data: {
        area: createSubproject.area,
        floor: createSubproject.floor,
        point: createSubproject.point,
        project: {connect: {id: createSubproject.projectId}},
        user: createSubproject?.userId ? {connect: {id: createSubproject.userId}} : undefined,
      }
    })
  }

  findAll() {
    return this.db.subProject.findMany()
  }

  findAllMy(userId: number) {
    this.db.subProject.findMany({
      where: {
        userId: userId,
      }
    })
  }

  findAvailable() {
    return this.db.subProject.findMany({
      where: {
        user: null
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} subproject`;
  }

  update(id: number, updateSubproject: Prisma.subProjectUpdateInput) {
    return `This action updates a #${id} subproject`;
  }

  remove(id: number) {
    return `This action removes a #${id} subproject`;
  }
}
