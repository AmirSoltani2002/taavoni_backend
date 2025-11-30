import { Injectable } from '@nestjs/common';
import { CreatePreSellingDto } from './dto/create-pre-selling.dto';
import { UpdatePreSellingDto } from './dto/update-pre-selling.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PreSellingService {
  constructor(private readonly db: DatabaseService) {}

  create(createPreSellingDto: CreatePreSellingDto & { totalPrice: number }) {
    const { projectId, userId, ...rest } = createPreSellingDto;
    return this.db.preSelling.create({
      data: {
        ...rest,
        project: { connect: { id: projectId } },
        user: { connect: { id: userId } },
      },
    });
  }

  findAll() {
    return this.db.preSelling.findMany();
  }

  findAllByUser(userId: number) {
    return this.db.preSelling.findMany({
      where: { userId },
    });
  }

  findAllBySubProject(projectId: number) {
    return this.db.preSelling.findMany({
      where: { projectId },
    });
  }

  findOne(id: number) {
    return this.db.preSelling.findUniqueOrThrow({
      where: { id },
    });
  }

  update(id: number, updatePreSellingDto: UpdatePreSellingDto) {
    const { projectId, userId, ...rest } = updatePreSellingDto;
    return this.db.preSelling.update({
      where: { id },
      data: {
        ...rest,
        project: projectId ? { connect: { id: projectId } } : undefined,
        user: userId ? { connect: { id: userId } } : undefined,
      },
    });
  }

  remove(id: number) {
    return this.db.preSelling.delete({
      where: { id },
    });
  }
}
