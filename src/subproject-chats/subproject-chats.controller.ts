import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException } from '@nestjs/common';
import { SubprojectChatsService } from './subproject-chats.service';
import { CreateSubprojectChatDto } from './dto/create-subproject-chat.dto';
import { UpdateSubprojectChatDto } from './dto/update-subproject-chat.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('subproject-chats')
export class SubprojectChatsController {
  constructor(private readonly subprojectChatsService: SubprojectChatsService) {}

  @Post()
  create(@Body() createSubprojectChatDto: CreateSubprojectChatDto, @Request() req) {
    createSubprojectChatDto.senderId = req['user'].id;
    return this.subprojectChatsService.create(createSubprojectChatDto);
  }

  @Roles(['admin', 'system'])
  @Get()
  findAll() {
    return this.subprojectChatsService.findAll();
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subprojectChatsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubprojectChatDto: UpdateSubprojectChatDto, @Request() req) {
    const message = await this.subprojectChatsService.findOne(+id);
    if(req['user'].type !== 'admin' && req['user'].type !== 'system' && req['user'].id !== message.senderId)
      throw new UnauthorizedException();
    return this.subprojectChatsService.update(+id, updateSubprojectChatDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const message = await this.subprojectChatsService.findOne(+id);
    if(req['user'].type !== 'admin' && req['user'].type !== 'system' && req['user'].id !== message.senderId)
      throw new UnauthorizedException();
    return this.subprojectChatsService.remove(+id);
  }
}
