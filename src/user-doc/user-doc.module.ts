import { Module } from '@nestjs/common';
import { UserDocService } from './user-doc.service';
import { UserDocController } from './user-doc.controller';

@Module({
  controllers: [UserDocController],
  providers: [UserDocService],
})
export class UserDocModule {}
