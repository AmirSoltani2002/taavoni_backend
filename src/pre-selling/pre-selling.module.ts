import { Module } from '@nestjs/common';
import { PreSellingService } from './pre-selling.service';
import { PreSellingController } from './pre-selling.controller';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  controllers: [PreSellingController],
  providers: [PreSellingService],
  imports: [ProjectsModule],
})
export class PreSellingModule {}
