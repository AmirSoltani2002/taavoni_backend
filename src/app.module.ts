import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import KeyvRedis from '@keyv/redis';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CacheInvalidationInterceptor } from './cache/cache-invalidation.interceptor';
import { UserAwareCacheInterceptor } from './cache/user-aware-cache.interceptor';
import { BlocksModule } from './blocks/blocks.module';
import { DatabaseModule } from './database/database.module';
import { FinalTransactionModule } from './final-transaction/final-transaction.module';
import { InvoiceModule } from './invoice/invoice.module';
import { OtherChatsModule } from './other-chats/other-chats.module';
import { OtherTicketsModule } from './other-tickets/other-tickets.module';
import { PostsModule } from './posts/posts.module';
import { PreSellingModule } from './pre-selling/pre-selling.module';
import { ProjectDocsModule } from './project-docs/project-docs.module';
import { ProjectsModule } from './projects/projects.module';
import { SubProjectDocsModule } from './sub-project-docs/sub-project-docs.module';
import { SubProjectTicketsModule } from './sub-project-tickets/sub-project-tickets.module';
import { SubprojectChatsModule } from './subproject-chats/subproject-chats.module';
import { SubprojectsModule } from './subprojects/subprojects.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserDocModule } from './user-doc/user-doc.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        stores: [
          new KeyvRedis(
            config.get<string>('REDIS_CACHE_URL') ??
              'redis://localhost:6379/0',
          ),
        ],
        ttl: config.get<number>('CACHE_TTL_MS') ?? 30_000,
      }),
    }),
    UsersModule,
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    SubprojectsModule,
    UserDocModule,
    PostsModule,
    SubProjectTicketsModule,
    OtherTicketsModule,
    OtherChatsModule,
    SubprojectChatsModule,
    ProjectDocsModule,
    SubProjectDocsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    BlocksModule,
    TransactionModule,
    InvoiceModule,
    TransactionHistoryModule,
    PreSellingModule,
    FinalTransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserAwareCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInvalidationInterceptor,
    },
  ],
})
export class AppModule {}
