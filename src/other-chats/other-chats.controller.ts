import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { OtherChatsService } from './other-chats.service';
import { CreateOtherChatDto } from './dto/create-other-chat.dto';
import { UpdateOtherChatDto } from './dto/update-other-chat.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('other-chats')
export class OtherChatsController {
  constructor(private readonly otherChatsService: OtherChatsService) {}

  @Post()
  create(@Body() createOtherChatDto: CreateOtherChatDto, @Request() req) {
    createOtherChatDto.senderId = req['user'].id;
    return this.otherChatsService.create(createOtherChatDto);
  }

  @Roles(['admin', 'system'])
  @Get()
  findAll() {
    return this.otherChatsService.findAll();
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherChatsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOtherChatDto: UpdateOtherChatDto, @Request() req) {
    const message = await this.otherChatsService.findOne(+id);
    if(!['system'].includes(req['user'].type) && message.senderId !== req['user'].id)
      throw new UnauthorizedException();
    return this.otherChatsService.update(+id, updateOtherChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const message = await this.otherChatsService.findOne(+id);
    if(!['admin', 'system'].includes(req['user'].type) && message.senderId !== req['user'].id)
      throw new UnauthorizedException();
    return this.otherChatsService.remove(+id);
  }
}
