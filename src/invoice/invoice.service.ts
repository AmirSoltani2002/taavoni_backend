import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class InvoiceService {
  constructor(private readonly db: DatabaseService) {}
  create(createInvoiceDto: CreateInvoiceDto) {
    const {userId, subProjectId, ...resti} = createInvoiceDto;
    const rest = resti as {
      amount?: number;
      number?: string;
      document: string;
    }
    return this.db.invoice.create({
      data:{
        ...rest,
        user: {connect: {id: userId}},
        subProject: {connect: {id: subProjectId}},
      }
    });
  }

  findAll() {
    return this.db.invoice.findMany({
      include: { subProject: true, user: true }
    });
  }

  findOne(id: number) {
    return this.db.invoice.findUniqueOrThrow({
      where: { id },
      include: { subProject: true, user: true }
    });
  }

  findManyByUserID(userId: number) {
    return this.db.invoice.findMany({
      where: { userId },
      include: { subProject: true, user: true }
    });
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const {userId, subProjectId, ...rest} = updateInvoiceDto;
    return this.db.invoice.update({
      where: { id },
      data: {
        ...rest,
        user: userId ? { connect: { id: userId } } : undefined,
        subProject: subProjectId ? { connect: { id: subProjectId } } : undefined,
      },
    });
  }

  remove(id: number) {
    return this.db.invoice.delete({
      where: { id },
    });
  }
}
