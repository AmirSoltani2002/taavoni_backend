import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreSellingService } from './pre-selling.service';
import { CreatePreSellingDto } from './dto/create-pre-selling.dto';
import { UpdatePreSellingDto } from './dto/update-pre-selling.dto';
import { Roles } from 'src/auth/roles.decorator';
import { ProjectsService } from 'src/projects/projects.service';

@Roles(['admin', 'system'])
@Controller('pre-selling')
export class PreSellingController {
  constructor(private readonly preSellingService: PreSellingService,
              private readonly projectsService: ProjectsService
  ) {}

  @Post()
  async create(@Body() createPreSellingDto: CreatePreSellingDto) {
    const project = await this.projectsService.findOne(createPreSellingDto.projectId);
    const totalPrice = createPreSellingDto.area * project.pricePerMeter;
    const payload = { ...createPreSellingDto, totalPrice };
    return this.preSellingService.create(payload);
  }

  @Get()
  findAll() {
    return this.preSellingService.findAll();
  }

  @Get('/user/:id')
  findOneByUser(@Param('id') id: string) {
    return this.preSellingService.findAllByUser(+id);
  }

  @Get('/project/:id')
  findOneBySubProject(@Param('id') id: string) {
    return this.preSellingService.findAllBySubProject(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preSellingService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePreSellingDto: UpdatePreSellingDto) {
    if(updatePreSellingDto.projectId){
      const project = await this.projectsService.findOne(updatePreSellingDto.projectId);
      if(updatePreSellingDto.area){
        updatePreSellingDto['totalPrice'] = updatePreSellingDto.area * project.pricePerMeter;
      } else {
        const existingPreSelling =  await this.preSellingService.findOne(+id);
        updatePreSellingDto['totalPrice'] = existingPreSelling.area * project.pricePerMeter;
      }
    }
    return this.preSellingService.update(+id, updatePreSellingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preSellingService.remove(+id);
  }
}
