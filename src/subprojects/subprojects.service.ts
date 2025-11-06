import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubprojectDto } from './dto/create-subproject.dto';
import { UpdateSubprojectDto } from './dto/update-subproject.dto';
import { DatabaseService } from 'src/database/database.service';
import { TransactionHistoryService } from 'src/transaction-history/transaction-history.service';

@Injectable()
export class SubprojectsService {
  constructor(private readonly db: DatabaseService, private readonly transactionHistoryService: TransactionHistoryService) {}
  
  async create(createSubproject: CreateSubprojectDto) {
    const {blockId, userId, ...rest} = createSubproject;
    return this.db.subProject.create({
      data: {
        ...rest,
        block: {connect: {id: blockId}},
        user: userId ? {connect: {id: userId}} : undefined,
      }
    })
  }

  findAll() {
    return this.db.subProject.findMany({
      include: {
        block: { include: { project: true } }
      }
    })
  }

  findAllByUser(id: number) {
    return this.db.subProject.findMany({
      where: {userId: id},
      include: {
        block: { include: { project: true } }
      }
    })
  }

  findOne(id: number) {
    try {
      return this.db.subProject.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          block: { include: { project: true } }
        }
      })
    } catch(_error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateSubproject: UpdateSubprojectDto) {
    const _record = await this.findOne(id);
    const {blockId, userId, ...rest} = updateSubproject;
    if(userId !== undefined && _record.userId !== null) {
      await this.transactionHistoryService.create({userId: _record.userId, subProjectId: id});
    }
    return this.db.subProject.update({
      where: {id},
      data: {
        ...rest,
        block: blockId ? {connect: {id: blockId}} : undefined,
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
