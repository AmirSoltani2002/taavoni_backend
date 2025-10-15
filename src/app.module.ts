import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalGuard } from './auth/auth.guard';
import { ProjectsModule } from './projects/projects.module';
import { SubprojectsModule } from './subprojects/subprojects.module';
import { UserDocModule } from './user-doc/user-doc.module';
import { PostsModule } from './posts/posts.module';
import { SubProjectTicketsModule } from './sub-project-tickets/sub-project-tickets.module';
import { OtherTicketsModule } from './other-tickets/other-tickets.module';
import { OtherChatsModule } from './other-chats/other-chats.module';
import { SubprojectChatsModule } from './subproject-chats/subproject-chats.module';
import { ProjectDocsModule } from './project-docs/project-docs.module';
import { SubProjectDocsModule } from './sub-project-docs/sub-project-docs.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { BlocksModule } from './blocks/blocks.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, ConfigModule.forRoot({isGlobal: true,}), ProjectsModule, SubprojectsModule, 
            UserDocModule, PostsModule, SubProjectTicketsModule, OtherTicketsModule, OtherChatsModule, SubprojectChatsModule, 
            ProjectDocsModule, SubProjectDocsModule, 
            CacheModule.register({
              store: redisStore,
              host: 'localhost',
              port: '6379',
              ttl: 30,
            }), 
            ServeStaticModule.forRoot({
              rootPath: join(__dirname, '..', '..', 'uploads'),
              serveRoot: '/uploads',
            }), BlocksModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
