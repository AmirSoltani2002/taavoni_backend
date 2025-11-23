import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

    @Roles(['admin', 'system'])
    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
      return this.projectsService.create(createProjectDto);
    }

    @Roles(['admin', 'system'])
    @Get('all')
    findAll() {
      return this.projectsService.findAll();
    }

    @Get('all/name')
    findAllName() {
      return this.projectsService.findAllName();
    }
  
    @Get('available')
    findAvailable() {
      return this.projectsService.findAvailable();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.projectsService.findOne(+id);
    }
  
    @Roles(['admin', 'system'])
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
      return this.projectsService.update(+id, updateProjectDto);
    }
  
    @Roles(['admin', 'system'])
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.projectsService.remove(+id);
    }
}
