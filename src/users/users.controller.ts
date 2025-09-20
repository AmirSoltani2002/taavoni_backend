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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public(true)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    //if (!file) throw new BadRequestException('National card file is required');
    const {accepted, ..._rest} = createUserDto;
    if(accepted !== undefined){
      throw new UnauthorizedException();
    }
    createUserDto.password = await PasswordService.hashPassword(createUserDto.password)
    return this.usersService.create(createUserDto);
  }

  @Roles(['system', 'admin'])
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  profile(@Request() req): any {
    const {password, ...rest} = req['user'];
    return rest;
  }

  @Patch('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const {password, ..._rest} = updateUserDto;
    if(updateUserDto?.type && !['admin', 'system'].includes(req['user'].type) && ['admin', 'system'].includes(updateUserDto.type) || updateUserDto?.accepted !== undefined  ){
      throw new UnauthorizedException();
    }
    if(password){
      updateUserDto.password = await PasswordService.hashPassword(password)
    }
    return this.usersService.update(+req['user'].id, updateUserDto);
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
