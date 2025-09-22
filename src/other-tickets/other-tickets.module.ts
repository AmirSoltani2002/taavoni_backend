import { Module } from '@nestjs/common';
import { OtherTicketsService } from './other-tickets.service';
import { OtherTicketsController } from './other-tickets.controller';

@Module({
  controllers: [OtherTicketsController],
  providers: [OtherTicketsService],
  exports: [OtherTicketsService],
})
export class OtherTicketsModule {}
