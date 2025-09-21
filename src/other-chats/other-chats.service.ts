import { Injectable } from '@nestjs/common';
import { CreateOtherChatDto } from './dto/create-other-chat.dto';
import { UpdateOtherChatDto } from './dto/update-other-chat.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OtherChatsService {
  constructor(private readonly db: DatabaseService) {}

  create(createOtherChatDto: CreateOtherChatDto) {
    const {senderId, ticketId, ...rest} = createOtherChatDto;
    return this.db.otherChat.create({ data:  {
      sender: { connect: { id: senderId } },
      ticket: { connect: { id: ticketId } },
      ...rest
    }});
  }

  findAll() {
    return this.db.otherChat.findMany();
  }

  findOne(id: number) {
    return this.db.otherChat.findUniqueOrThrow({ where: { id } });
  }

  update(id: number, updateOtherChatDto: UpdateOtherChatDto) {
    return this.db.otherChat.update({ where: { id }, data: updateOtherChatDto });
  }

  remove(id: number) {
    return this.db.otherChat.delete({ where: { id } });
  }
}
