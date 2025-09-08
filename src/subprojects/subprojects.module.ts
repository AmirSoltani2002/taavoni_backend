import { Module } from '@nestjs/common';
import { SubprojectsService } from './subprojects.service';
import { SubprojectsController } from './subprojects.controller';

@Module({
  controllers: [SubprojectsController],
  providers: [SubprojectsService],
})
export class SubprojectsModule {}
