import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostsService {
  constructor(private readonly db: DatabaseService){}

  create(createPostDto: CreatePostDto) {
    const {subProjectId, ...rest} = createPostDto;
    return this.db.post.create({
      data: {
        ...rest,
        subProject: {connect: {id: subProjectId}}
      }
    })
  }

  findAll() {
    return this.db.post.findMany({
      include: {subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }
      }
    })
  }

  findOne(id: number) {
    return this.db.post.findUnique({
      where: {id},
      include: {subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }
      }
    })
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    const {subProjectId, ...rest} = updatePostDto;
    return this.db.post.update({
      where: {id},
      data: {
        ...rest,
        subProject: subProjectId ? {connect: {id: subProjectId}} : undefined
      }
    })
  }

  remove(id: number) {
    return this.db.post.delete({
      where: {id}
    })
  }

  findAllBySubProject(id: number) {
    return this.db.post.findMany({
      where: {subProjectId: id},
      include: {subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }
      }
    })
  }

  findAllByProject(id: number) {
    return this.db.post.findMany({
      where: {subProject: {
        block: {
          projectId: id
        }
      }},
      include: {subProject: {
        include: {
          block: {
            include: {
              project: true
            }
          }
        }
      }
      }
    })
  }
}
