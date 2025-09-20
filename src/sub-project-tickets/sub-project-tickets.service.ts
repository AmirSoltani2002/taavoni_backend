import { Injectable } from '@nestjs/common';
import { CreateSubProjectTicketDto } from './dto/create-sub-project-ticket.dto';
import { UpdateSubProjectTicketDto } from './dto/update-sub-project-ticket.dto';
import { DatabaseService } from 'src/database/database.service';
import { subProjectTicketType } from '@prisma/client';

@Injectable()
export class SubProjectTicketsService {
  constructor(private readonly db: DatabaseService) {}

    create(createSubProjectTicketDto: CreateSubProjectTicketDto) {
      return this.db.subProjectTicket.create({ data: createSubProjectTicketDto });
    }
  
    findAll(queryType?: string) {
      return this.db.subProjectTicket.findMany({
        where: {type: queryType as subProjectTicketType},
      });
    }
  
    findOne(id: number) {
      return this.db.subProjectTicket.findUniqueOrThrow({ where: { id } });
    }
  
    update(id: number, updateSubProjectTicketDto: UpdateSubProjectTicketDto) {
      return this.db.subProjectTicket.update({ where: { id }, data: updateSubProjectTicketDto });
    }
  
    remove(id: number) {
      return this.db.subProjectTicket.delete({ where: { id } });
    }
  
    findOneChats(id: number) {
      return this.db.subProjectTicket.findMany({ where: { id }, include: { chats: {orderBy: {createdAt: 'asc'}} } });
    }
    
    findAllUser(id: number, queryType?: string) {
      return this.db.subProjectTicket.findMany({
        where: { userId: id,
          ...(queryType ? { type: queryType as subProjectTicketType } : {}),
        },
        orderBy: { updatedAt: 'desc' },
      });
    }
}
