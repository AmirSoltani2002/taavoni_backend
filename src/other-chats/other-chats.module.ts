import { Module } from '@nestjs/common';
import { OtherChatsService } from './other-chats.service';
import { OtherChatsController } from './other-chats.controller';

@Module({
  controllers: [OtherChatsController],
  providers: [OtherChatsService],
  exports: [OtherChatsService],
})
export class OtherChatsModule {}
