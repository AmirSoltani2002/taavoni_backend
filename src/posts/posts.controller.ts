import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Roles(['admin', 'system'])
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('subproject/:id')
  findOneByProject(@Param('id') id: string) {
    return this.postsService.findAllBySubProject(+id);
  }

  @Get('project/:id')
  findOneBysubProject(@Param('id') id: string) {
    return this.postsService.findAllByProject(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }


  @Roles(['admin', 'system'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Roles(['admin', 'system'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
