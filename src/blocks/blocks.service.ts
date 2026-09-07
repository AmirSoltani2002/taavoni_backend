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
    const { projectId, ...data } = updateBlockDto;

    return this.db.$transaction(async (transaction) => {
      const block = await transaction.block.update({
        where: { id },
        data: {
          ...data,
          project: projectId
            ? {
                connect: {
                  id: projectId,
                },
              }
            : undefined,
        },
      });

      if (updateBlockDto.negativeFloorCount !== undefined) {
        await transaction.negativeFloor.deleteMany({
          where: {
            blockId: id,
            floorNumber: { gt: updateBlockDto.negativeFloorCount },
          },
        });
      }

      return block;
    });
  }

  remove(id: number) {
    return this.db.block.delete({
      where: { id }
    });
  }
}
