import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PasswordService } from 'src/auth/config';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, Roles } from 'src/auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public(true)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create user with national card file upload',
    type: CreateUserDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/nationalCards',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    //if (!file) throw new BadRequestException('National card file is required');
    createUserDto.nationalCard = `/uploads/nationalCards/${file.filename}`;
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
    return req?.user;
  }

  @Patch('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Request() req) {
    const {password, ..._rest} = updateUserDto;
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
  findOneByNationalNumber(@Param('nationalNumber') nationalNumber: string) {
    return this.usersService.findOneByNationalNumber(nationalNumber);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Roles(['system', 'admin'])
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(['admin', 'system'])
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const {password, ..._rest} = updateUserDto;
    if(password){
      updateUserDto.password = await PasswordService.hashPassword(password)
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Roles(['system', 'admin'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
