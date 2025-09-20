import { Injectable } from '@nestjs/common';
import { CreateSubprojectChatDto } from './dto/create-subproject-chat.dto';
import { UpdateSubprojectChatDto } from './dto/update-subproject-chat.dto';

@Injectable()
export class SubprojectChatsService {
  create(createSubprojectChatDto: CreateSubprojectChatDto) {
    return 'This action adds a new subprojectChat';
  }

  findAll() {
    return `This action returns all subprojectChats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subprojectChat`;
  }

  update(id: number, updateSubprojectChatDto: UpdateSubprojectChatDto) {
    return `This action updates a #${id} subprojectChat`;
  }

  remove(id: number) {
    return `This action removes a #${id} subprojectChat`;
  }
}
