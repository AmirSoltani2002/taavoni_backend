import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SubprojectsService } from './subprojects.service';
import { CreateSubprojectDto } from './dto/create-subproject.dto';
import { UpdateSubprojectDto } from './dto/update-subproject.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('subprojects')
export class SubprojectsController {
  constructor(private readonly subprojectsService: SubprojectsService) {}

  @Roles(['admin', 'system'])
  @Post()
  create(@Body() createSubprojectDto: CreateSubprojectDto) {
    return this.subprojectsService.create(createSubprojectDto);
  }

  @Roles(['admin', 'system'])
  @Get('all')
  findAll() {
    return this.subprojectsService.findAll();
  }

  @Roles(['admin', 'system'])
  @Get('user/:id') 
  findAllByUser(@Param('id') id: number){
    return this.subprojectsService.findAllByUser(+id)
  }

  @Get('profile') 
  findMy(@Request() req){
    return this.subprojectsService.findAllByUser(req['user'].id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subprojectsService.findOne(+id);
  }

  @Roles(['admin', 'system'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubprojectDto: UpdateSubprojectDto) {
    return this.subprojectsService.update(+id, updateSubprojectDto);
  }

  @Roles(['admin', 'system'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subprojectsService.remove(+id);
  }
}
