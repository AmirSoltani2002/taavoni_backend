import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly db: DatabaseService){}

  create(createProjectDto: CreateProjectDto) {
    return this.db.project.create({
      data: createProjectDto
    })
  }

  findAll() {
    return this.db.project.findMany({
      include: {
        blocks: {
          include: {
            subProjects: true
          }
        }
      }
    })
  }

  findAvailable() {
    return this.db.project.findMany({
      where: {
        blocks: {
          some: {
            subProjects: {
              some: {
                userId: null
              }
            }
          }
        }
      },
      include: {
        blocks: {
          include: {
            subProjects: true
          }
        }
      }
    })
  }

  findOne(id: number) {
    try {
      return this.db.project.findUniqueOrThrow({
        where: {
          id: id,
        }
      })
    } catch(_error) {
      throw new NotFoundException();
    }
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const record = await this.findOne(id);
    return this.db.project.update({
      where: {id},
      data: updateProjectDto,
    })
  }

  async remove(id: number) {
    const record = await this.findOne(id);
    return this.db.project.delete({
      where: {id},
    })
  }
}
