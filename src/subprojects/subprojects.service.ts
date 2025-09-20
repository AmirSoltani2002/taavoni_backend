import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubprojectDto } from './dto/create-subproject.dto';
import { UpdateSubprojectDto } from './dto/update-subproject.dto';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubprojectsService {
  constructor(private readonly db: DatabaseService) {}
  
  async create(createSubproject: CreateSubprojectDto) {
    const {projectId, userId, ...rest} = createSubproject;
    return this.db.subProject.create({
      data: {
        ...rest,
        project: {connect: {id: projectId}},
        user: userId ? {connect: {id: userId}} : undefined,
      }
    })
  }

  findAll() {
    return this.db.subProject.findMany()
  }

  findAllByUser(id: number) {
    return this.db.subProject.findMany({
      where: {userId: id}
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

  async update(id: number, updateSubproject: UpdateSubprojectDto) {
    const _record = await this.findOne(id);
    const {projectId, userId, ...rest} = updateSubproject;
    return this.db.subProject.update({
      where: {id},
      data: {
        ...rest,
        project: projectId ? {connect: {id: projectId}} : undefined,
        user: userId ? {connect: {id: userId}} : undefined,
      },
    })
  }

  async remove(id: number) {
    const _record = await this.findOne(id);
    return this.db.subProject.delete({
      where: {id},
    })
  }
}
