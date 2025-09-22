import { Injectable } from '@nestjs/common';
import { CreateOtherTicketDto } from './dto/create-other-ticket.dto';
import { UpdateOtherTicketDto } from './dto/update-other-ticket.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OtherTicketsService {
  constructor(private readonly db: DatabaseService) {}

  create(createOtherTicketDto: CreateOtherTicketDto) {
    const {userId, recieverId, ...rest} = createOtherTicketDto;
    return this.db.otherTicket.create({ data: {
      user: { connect: { id: userId } },
      reciever: { connect: { id: recieverId } },
      ...rest
    } });
  }

  findAll(queryType?: string) {
    return this.db.otherTicket.findMany({
      where: queryType ? { type: queryType } : {},
      include: {user: true, reciever: true}
    });
  }

  findOne(id: number) {
    return this.db.otherTicket.findUniqueOrThrow({ where: { id },
      include: {user: true, reciever: true} });
  }

  update(id: number, updateOtherTicketDto: UpdateOtherTicketDto) {
    const {userId, recieverId, ...rest} = updateOtherTicketDto;
    return this.db.otherTicket.update({ where: { id }, data: {
      user: userId ? { connect: { id: userId } } : undefined,
      reciever: recieverId ? { connect: { id: recieverId } } : undefined,
      ...rest
    } });
  }

  remove(id: number) {
    return this.db.otherTicket.delete({ where: { id } });
  }

  findOneChats(id: number) {
    return this.db.otherTicket.findMany({ where: { id }, include: { chats: {orderBy: { createdAt: 'asc' }, include: {sender: true} }}  });
  }
  
  findAllUser(id: number, queryType?: string) {
    return this.db.otherTicket.findMany({
      where: {
        OR: [{ userId: id }, { recieverId: id }],
        ...(queryType ? { type: queryType } : {}),
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        user: true,
        reciever: true
      }
    });
  }
}
