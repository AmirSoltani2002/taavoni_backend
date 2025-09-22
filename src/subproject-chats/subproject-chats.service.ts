import { Injectable } from '@nestjs/common';
import { CreateSubprojectChatDto } from './dto/create-subproject-chat.dto';
import { UpdateSubprojectChatDto } from './dto/update-subproject-chat.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class SubprojectChatsService {
  constructor(private readonly db: DatabaseService){}

  create(createSubprojectChatDto: CreateSubprojectChatDto) {
    const { ticketId, senderId, message } = createSubprojectChatDto;
    return this.db.subProjectChat.create({data: {
      ticket: { connect: { id: ticketId } },
      sender: { connect: { id: senderId } },
      message: message
    }});
  }

  findAll() {
    return this.db.subProjectChat.findMany({
      include: {
        sender: true,
        ticket: true,
      }
    });
  }

  findOne(id: number) {
    return this.db.subProjectChat.findUniqueOrThrow({ 
      where: { id },
      include: {
        sender: true,
        ticket: true,
      },
      });
  }

  update(id: number, updateSubprojectChatDto: UpdateSubprojectChatDto) {
    return this.db.subProjectChat.update({
      where: { id },
      data: updateSubprojectChatDto
    });
  }

  remove(id: number) {
    return this.db.subProjectChat.delete({ where: { id } });
  }
}
