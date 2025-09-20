import { Injectable } from '@nestjs/common';
import { CreateOtherTicketDto } from './dto/create-other-ticket.dto';
import { UpdateOtherTicketDto } from './dto/update-other-ticket.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OtherTicketsService {
  constructor(private readonly db: DatabaseService) {}

  create(createOtherTicketDto: CreateOtherTicketDto) {
    return this.db.otherTicket.create({ data: createOtherTicketDto });
  }

  findAll(queryType?: string) {
    return this.db.otherTicket.findMany({
      where: queryType ? { type: queryType } : {},
    });
  }

  findOne(id: number) {
    return this.db.otherTicket.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateOtherTicketDto: UpdateOtherTicketDto) {
    return this.db.otherTicket.update({ where: { id }, data: updateOtherTicketDto });
  }

  remove(id: number) {
    return this.db.otherTicket.delete({ where: { id } });
  }

  findOneChats(id: number) {
    return this.db.otherTicket.findMany({ where: { id }, include: { chats: {orderBy: { createdAt: 'asc' } }}  });
  }
  
  findAllUser(id: number, queryType?: string) {
    return this.db.otherTicket.findMany({
      where: {
        OR: [{ userId: id }, { recieverId: id }],
        ...(queryType ? { type: queryType } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
