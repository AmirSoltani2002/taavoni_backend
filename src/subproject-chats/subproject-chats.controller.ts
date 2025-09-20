import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubprojectChatsService } from './subproject-chats.service';
import { CreateSubprojectChatDto } from './dto/create-subproject-chat.dto';
import { UpdateSubprojectChatDto } from './dto/update-subproject-chat.dto';

@Controller('subproject-chats')
export class SubprojectChatsController {
  constructor(private readonly subprojectChatsService: SubprojectChatsService) {}

  @Post()
  create(@Body() createSubprojectChatDto: CreateSubprojectChatDto) {
    return this.subprojectChatsService.create(createSubprojectChatDto);
  }

  @Get()
  findAll() {
    return this.subprojectChatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subprojectChatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubprojectChatDto: UpdateSubprojectChatDto) {
    return this.subprojectChatsService.update(+id, updateSubprojectChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subprojectChatsService.remove(+id);
  }
}
