import { Module } from '@nestjs/common';
import { UserDocService } from './user-doc.service';
import { UserDocController } from './user-doc.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UserDocController],
  providers: [UserDocService],
  imports: [UsersModule],
})
export class UserDocModule {}
