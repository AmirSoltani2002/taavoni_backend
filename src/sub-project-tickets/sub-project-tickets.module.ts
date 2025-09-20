import { Module } from '@nestjs/common';
import { SubProjectTicketsService } from './sub-project-tickets.service';
import { SubProjectTicketsController } from './sub-project-tickets.controller';

@Module({
  controllers: [SubProjectTicketsController],
  providers: [SubProjectTicketsService],
})
export class SubProjectTicketsModule {}
