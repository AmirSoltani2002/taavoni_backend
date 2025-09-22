import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OtherChatsModule } from 'src/other-chats/other-chats.module';
import { OtherTicketsModule } from 'src/other-tickets/other-tickets.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [OtherTicketsModule, OtherChatsModule],
})
export class UsersModule {}
