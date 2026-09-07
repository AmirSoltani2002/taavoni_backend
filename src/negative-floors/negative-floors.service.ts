import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateNegativeFloorDto } from './dto/create-negative-floor.dto';
import { UpdateNegativeFloorDto } from './dto/update-negative-floor.dto';

@Injectable()
export class NegativeFloorsService {
  constructor(private readonly db: DatabaseService) {}

  async create(createNegativeFloorDto: CreateNegativeFloorDto) {
    const { blockId, ...data } = createNegativeFloorDto;
    await this.validateFloorNumber(blockId, data.floorNumber);

    return this.db.negativeFloor.create({
      data: {
        ...data,
        block: { connect: { id: blockId } },
      },
    });
  }

  createMany(createNegativeFloorDtos: CreateNegativeFloorDto[]) {
    return Promise.all(
      createNegativeFloorDtos.map((data) => this.create(data)),
    );
  }

  findAll() {
    return this.db.negativeFloor.findMany();
  }

  findAllByBlock(blockId: number) {
    return this.db.negativeFloor.findMany({
      where: { blockId },
      orderBy: { floorNumber: 'asc' },
    });
  }

  async findOne(id: number) {
    try {
      return await this.db.negativeFloor.findUniqueOrThrow({ where: { id } });
    } catch {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateNegativeFloorDto: UpdateNegativeFloorDto) {
    const record = await this.findOne(id);
    const blockId = updateNegativeFloorDto.blockId ?? record.blockId;
    const floorNumber =
      updateNegativeFloorDto.floorNumber ?? record.floorNumber;
    await this.validateFloorNumber(blockId, floorNumber);

    const { blockId: requestedBlockId, ...data } = updateNegativeFloorDto;
    return this.db.negativeFloor.update({
      where: { id },
      data: {
        ...data,
        block: requestedBlockId
          ? { connect: { id: requestedBlockId } }
          : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.db.negativeFloor.delete({ where: { id } });
  }

  private async validateFloorNumber(blockId: number, floorNumber: number) {
    const block = await this.db.block.findUnique({
      where: { id: blockId },
      select: { negativeFloorCount: true },
    });

    if (!block) {
      throw new NotFoundException('Block not found');
    }

    if (floorNumber > block.negativeFloorCount) {
      throw new BadRequestException(
        'Floor number exceeds the block negative-floor count',
      );
    }
  }
}
