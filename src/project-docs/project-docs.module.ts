import { Module } from '@nestjs/common';
import { ProjectDocsService } from './project-docs.service';
import { ProjectDocsController } from './project-docs.controller';

@Module({
  controllers: [ProjectDocsController],
  providers: [ProjectDocsService],
})
export class ProjectDocsModule {}
