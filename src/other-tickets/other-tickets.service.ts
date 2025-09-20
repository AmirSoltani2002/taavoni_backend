import { Injectable } from '@nestjs/common';
import { CreateOtherTicketDto } from './dto/create-other-ticket.dto';
import { UpdateOtherTicketDto } from './dto/update-other-ticket.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OtherTicketsService {
  constructor(private readonly db: DatabaseService) {}

  create(createOtherTicketDto: CreateOtherTicketDto) {
    return this.db.otherTickets.create({ data: createOtherTicketDto });
  }

  findAll(queryType?: string) {
    return this.db.otherTickets.findMany({
      where: queryType ? { type: queryType } : {},
    });
  }

  findOne(id: number) {
    return this.db.otherTickets.findUnique({ where: { id } });
  }

  update(id: number, updateOtherTicketDto: UpdateOtherTicketDto) {
    return this.db.otherTickets.update({ where: { id }, data: updateOtherTicketDto });
  }

  remove(id: number) {
    return this.db.otherTickets.delete({ where: { id } });
  }

  findOneChats(id: number) {
    return this.db.otherTickets.findMany({ where: { id }, include: { chats: true }, orderBy: { chats: { createdAt: 'asc' } }   });
  }
  
  findAllUser(id: number, queryType?: string) {
    return this.db.otherTickets.findMany({
      where: {
        OR: [{ userId: id }, { recieverId: id }],
        ...(queryType ? { type: queryType } : {}),
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
