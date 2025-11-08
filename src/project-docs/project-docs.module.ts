import { Module } from '@nestjs/common';
import { ProjectDocsService } from './project-docs.service';
import { ProjectDocsController } from './project-docs.controller';
import { SubprojectsModule } from 'src/subprojects/subprojects.module';

@Module({
  controllers: [ProjectDocsController],
  providers: [ProjectDocsService],
  imports: [SubprojectsModule]
})
export class ProjectDocsModule {}
