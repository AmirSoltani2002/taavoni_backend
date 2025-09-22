import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Request,
  UnauthorizedException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { PasswordService } from 'src/auth/config';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles } from 'src/auth/roles.decorator';
import { OtherTicketsService } from 'src/other-tickets/other-tickets.service';
import { OtherChatsService } from 'src/other-chats/other-chats.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, 
              private readonly otherTicketsService: OtherTicketsService,
              private readonly otherChatsService: OtherChatsService) {}

  @Public(true)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    //if (!file) throw new BadRequestException('National card file is required');
    const {accepted, ...rest} = createUserDto;
    rest.password = await PasswordService.hashPassword(rest.password);
    const user =  await this.usersService.create(rest);
    const ticketBody = {
      userId: user.id,
      type: 'signup',
    };
    const ticket = await this.otherTicketsService.create(ticketBody);
    const chatBody = {
      senderId: user.id,
      ticketId: ticket.id,
      message: `من، ${user.name} ${user.lastName} با کدملی ${user.nationalNumber}، درخواست ثبتنام در سیستم تعاونی مسکن شماره سه کارکنان دانشگاه تهران را دارم.`
    };
    const _chat = await this.otherChatsService.create(chatBody);
    return user;
  }

  @Roles(['system', 'admin'])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  async profile(@Request() req): Promise<any> {
    const userId = req['user'].id;
    const user = await this.usersService.findOne(userId);
    if(!user)
      throw new NotFoundException();
    const {password, ...rest} = user;
    return rest;
  }

  @Patch('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const {password, ..._rest} = updateUserDto;
    if((updateUserDto?.type && !['admin', 'system'].includes(req['user'].type) && ['admin', 'system'].includes(updateUserDto.type) ) || updateUserDto?.accepted !== undefined  ){
      throw new UnauthorizedException();
    }
    if(password){
      updateUserDto.password = await PasswordService.hashPassword(password)
    }
    const updatedUser = await this.usersService.update(+req['user'].id, updateUserDto);
    const {password: _pass, ...rest} = updatedUser;
    return rest;
  }

  @Delete('profile')
  removeProfile(@Request() req) {
    return this.usersService.remove(+req['user'].id);
  }

  @Get('national/:nationalNumber')
  async findOneByNationalNumber(@Param('nationalNumber') nationalNumber: string) {
    const user = await this.usersService.findOneByNationalNumber(nationalNumber);
    if(!user)
      throw new NotFoundException();
    const {password, ...rest} = user;
    return rest;
  }

  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if(!user)
      throw new NotFoundException();
    const {password, ...rest} = user;
    return rest;
  }

  @Roles(['system', 'admin'])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user =  await this.usersService.findOne(+id);
    if(!user)
      throw new NotFoundException();
    const {password, ...rest} = user;
    return rest;
  }

  @Roles(['admin', 'system'])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const {password, ..._rest} = updateUserDto;
    if(password){
      updateUserDto.password = await PasswordService.hashPassword(password);
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(['system', 'admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
