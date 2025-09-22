import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UnauthorizedException, Query } from '@nestjs/common';
import { OtherTicketsService } from './other-tickets.service';
import { CreateOtherTicketDto } from './dto/create-other-ticket.dto';
import { UpdateOtherTicketDto } from './dto/update-other-ticket.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('other-tickets')
export class OtherTicketsController {
  constructor(private readonly otherTicketsService: OtherTicketsService) {}

  @Post()
  create(@Body() createOtherTicketDto: CreateOtherTicketDto, @Request() req) {
    const {recieverRead, senderRead, closed, ...rest} = createOtherTicketDto;
    rest.userId = req['user'].id;
    return this.otherTicketsService.create(rest);
  }

  @Get('profile')
  findAllUser(@Request() req, @Query('type') type?: string) {
    return this.otherTicketsService.findAllUser(req['user'].id, type);
  }

  @Get('chat/:id')
  async findOneChats(@Param('id') id: string, @Request() req) {
    const thisticket = await this.otherTicketsService.findOne(+id);
    if(thisticket.userId != req['user'].id && thisticket.recieverId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
      throw new UnauthorizedException();
    }
    return this.otherTicketsService.findOneChats(+id);
  }

  @Roles(['admin', 'system'])
  @Get()
  findAll(@Query('type') type?: string) {
    return this.otherTicketsService.findAll(type);
  }

  @Roles(['admin', 'system'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.otherTicketsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOtherTicketDto: UpdateOtherTicketDto, @Request() req) {
    const thisticket = await this.otherTicketsService.findOne(+id);
    if(thisticket.userId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
      throw new UnauthorizedException();
    }
    return this.otherTicketsService.update(+id, updateOtherTicketDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const thisticket = await this.otherTicketsService.findOne(+id);
    if(thisticket.userId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
      throw new UnauthorizedException();
    }
    return this.otherTicketsService.remove(+id);
  }
}
