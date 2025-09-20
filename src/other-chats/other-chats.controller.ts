import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OtherChatsService } from './other-chats.service';
import { CreateOtherChatDto } from './dto/create-other-chat.dto';
import { UpdateOtherChatDto } from './dto/update-other-chat.dto';

@Controller('other-chats')
export class OtherChatsController {
  constructor(private readonly otherChatsService: OtherChatsService) {}

  @Post()
  create(@Body() createOtherChatDto: CreateOtherChatDto) {
    return this.otherChatsService.create(createOtherChatDto);
  }

  @Get()
  findAll() {
    return this.otherChatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherChatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOtherChatDto: UpdateOtherChatDto) {
    return this.otherChatsService.update(+id, updateOtherChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.otherChatsService.remove(+id);
  }
}
