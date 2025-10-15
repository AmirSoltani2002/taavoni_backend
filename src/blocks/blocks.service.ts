import { Injectable } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class BlocksService {
  constructor(private readonly db: DatabaseService) {}
  create(createBlockDto: CreateBlockDto) {
    const {projectId, ...data} = createBlockDto;
    return this.db.block.create({
      data: {
        ...data,
        project: {
          connect: {
            id: projectId
          }
        }
      }
    });
  }

  findAll() {
    return this.db.block.findMany();
  }

  findOne(id: number) {
    return this.db.block.findUnique({
      where: { id }
    });
  }

  update(id: number, updateBlockDto: UpdateBlockDto) {
    const {projectId, ...data} = updateBlockDto;
    if(projectId) {
      return this.db.block.update({
        where: { id },
        data: {
          ...data,
          project: {
            connect: {
              id: projectId
            }
          }
        }
      });
    } else {
      return this.db.block.update({
        where: { id },
        data
      });
    }
  }

  remove(id: number) {
    return this.db.block.delete({
      where: { id }
    });
  }
}
