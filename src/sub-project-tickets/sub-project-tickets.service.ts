import { Injectable } from '@nestjs/common';
import { CreateSubProjectTicketDto } from './dto/create-sub-project-ticket.dto';
import { UpdateSubProjectTicketDto } from './dto/update-sub-project-ticket.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubProjectTicketsService {
  constructor(private readonly db: DatabaseService) {}

    create(createSubProjectTicketDto: CreateSubProjectTicketDto) {
      return this.db.subProjectTicket.create({ data: createSubProjectTicketDto });
    }
  
    findAll(queryType?: string) {
      return this.db.subProjectTicket.findMany({
        where: queryType ? { type: queryType } : {},
      });
    }
  
    findOne(id: number) {
      return this.db.subProjectTicket.findUnique({ where: { id } });
    }
  
    update(id: number, updateSubProjectTicketDto: UpdateSubProjectTicketDto) {
      return this.db.subProjectTicket.update({ where: { id }, data: updateSubProjectTicketDto });
    }
  
    remove(id: number) {
      return this.db.subProjectTicket.delete({ where: { id } });
    }
  
    findOneChats(id: number) {
      return this.db.subProjectTicket.findMany({ where: { id }, include: { chats: true }, orderBy: { chats: { createdAt: 'asc' } }   });
    }
    
    findAllUser(id: number, queryType?: string) {
      return this.db.subProjectTicket.findMany({
        where: {
          OR: [{ userId: id }, { recieverId: id }],
          ...(queryType ? { type: queryType } : {}),
        },
        orderBy: { updatedAt: 'desc' },
      });
    }
}
