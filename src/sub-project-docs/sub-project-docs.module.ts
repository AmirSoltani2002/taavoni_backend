import { Module } from '@nestjs/common';
import { SubProjectDocsService } from './sub-project-docs.service';
import { SubProjectDocsController } from './sub-project-docs.controller';

@Module({
  controllers: [SubProjectDocsController],
  providers: [SubProjectDocsService],
})
export class SubProjectDocsModule {}
