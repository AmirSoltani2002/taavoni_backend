import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UnauthorizedException } from '@nestjs/common';
import { SubProjectTicketsService } from './sub-project-tickets.service';
import { CreateSubProjectTicketDto } from './dto/create-sub-project-ticket.dto';
import { UpdateSubProjectTicketDto } from './dto/update-sub-project-ticket.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UpdateOtherTicketDto } from 'src/other-tickets/dto/update-other-ticket.dto';

@Controller('sub-project-tickets')
export class SubProjectTicketsController {
  constructor(private readonly subProjectTicketsService: SubProjectTicketsService) {}

  @Post()
    create(@Body() createSubProjectTicketDto: CreateSubProjectTicketDto, @Request() req) {
      const {senderRead, adminRead, closed, ...rest} = createSubProjectTicketDto;
      rest.userId = req['user'].id;
      return this.subProjectTicketsService.create(rest);
    }
  
    @Roles(['admin', 'system'])
    @Get()
    findAll(@Query('type') type?: string) {
      return this.subProjectTicketsService.findAll(type);
    }
  
    @Get('profile')
    findAllUser(@Request() req, @Query('type') type?: string) {
      return this.subProjectTicketsService.findAllUser(+req['user'].id, type);
    }
  
    @Roles(['admin', 'system'])
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.subProjectTicketsService.findOne(+id);
    }
  
    @Get('chat/:id')
    async findOneChats(@Param('id') id: string, @Request() req) {
      const thisticket = await this.subProjectTicketsService.findOne(+id);
      if(thisticket.userId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
        throw new UnauthorizedException();
      }
      return this.subProjectTicketsService.findOneChats(+id);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateSubProjectTicketDto: UpdateSubProjectTicketDto, @Request() req) {
      const thisticket = await this.subProjectTicketsService.findOne(+id);
      if(thisticket.userId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
        throw new UnauthorizedException();
      }
      return this.subProjectTicketsService.update(+id, updateSubProjectTicketDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
      const thisticket = await this.subProjectTicketsService.findOne(+id);
      if(thisticket.userId != req['user'].id && !['admin', 'system'].includes(req['user'].type)){
        throw new UnauthorizedException();
      }
      return this.subProjectTicketsService.remove(+id);
    }
}
