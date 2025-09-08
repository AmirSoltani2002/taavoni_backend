import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubprojectDto } from './dto/create-subproject.dto';
import { UpdateSubprojectDto } from './dto/update-subproject.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubprojectsService {
  constructor(private readonly db: DatabaseService) {}
  
  async create(createSubproject: CreateSubprojectDto) {
    try{
      return await this.db.subProject.create({
      data: {
        area: createSubproject.area,
        floor: createSubproject.floor,
        point: createSubproject.point,
        project: {connect: {id: createSubproject.projectId}},
        user: createSubproject?.userId ? {connect: {id: createSubproject.userId}} : undefined,
      }
    })
    } catch(error){
      if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
        throw new NotFoundException();
    }
  }

  findAll() {
    return this.db.subProject.findMany()
  }

  findAvailable() {
    return this.db.subProject.findMany({
      where: {
        user: null
      }
    })
  }

  findOne(id: number) {
    try {
      return this.db.subProject.findUniqueOrThrow({
        where: {
          id: id,
        }
      })
    } catch(_error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateSubproject: Prisma.subProjectUpdateInput) {
    const record = await this.findOne(id);
    return this.db.subProject.update({
      where: {id},
      data: updateSubproject,
    })
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.db.subProject.delete({
      where: {id},
    })
  }
}
