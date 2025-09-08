import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, RolesGuard } from './auth/auth.guard';
import { ProjectsModule } from './projects/projects.module';
import { SubprojectsModule } from './subprojects/subprojects.module';

@Module({
  imports: [UsersModule, DatabaseModule, AuthModule, ConfigModule.forRoot({isGlobal: true,}), ProjectsModule, SubprojectsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
