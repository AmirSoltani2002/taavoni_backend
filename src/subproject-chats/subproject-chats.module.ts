import { Module } from '@nestjs/common';
import { SubprojectChatsService } from './subproject-chats.service';
import { SubprojectChatsController } from './subproject-chats.controller';

@Module({
  controllers: [SubprojectChatsController],
  providers: [SubprojectChatsService],
})
export class SubprojectChatsModule {}
