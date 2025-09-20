import { Injectable } from '@nestjs/common';
import { CreateOtherChatDto } from './dto/create-other-chat.dto';
import { UpdateOtherChatDto } from './dto/update-other-chat.dto';

@Injectable()
export class OtherChatsService {
  create(createOtherChatDto: CreateOtherChatDto) {
    return 'This action adds a new otherChat';
  }

  findAll() {
    return `This action returns all otherChats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} otherChat`;
  }

  update(id: number, updateOtherChatDto: UpdateOtherChatDto) {
    return `This action updates a #${id} otherChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} otherChat`;
  }
}
