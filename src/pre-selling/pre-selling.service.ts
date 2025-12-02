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
      include: {
        project: true,
        user: true
      },
    });
  }

  findAll() {
    return this.db.preSelling.findMany({
      include: {
        project: true,
        user: true
      },
    });
  }

  findAllByUser(userId: number) {
    return this.db.preSelling.findMany({
      where: { userId },
      include: {
        project: true,
        user: true
      },
    });
  }

  findAllBySubProject(projectId: number) {
    return this.db.preSelling.findMany({
      where: { projectId },
      include: {
        project: true,
        user: true
      },
    });
  }

  findOne(id: number) {
    return this.db.preSelling.findUniqueOrThrow({
      where: { id },
      include: {
        project: true,
        user: true
      },
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
