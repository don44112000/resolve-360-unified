import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Configuration
import { initEnvironmentNest } from './config/environment';
import { initPostgres } from './config/postgres';
import { HttpConfigService } from './config/HttpConfig.service';

// Modules
import { BaseModule } from './modules/base/base.module';
import { CommonModule } from './modules/common/common.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BrandsModule } from './modules/brands/brands.module';
import { PostsModule } from './modules/posts/posts.module';
import { PostAttachmentsModule } from './modules/post-attachments/post-attachments.module';
import { SharedModule } from './shared/shared.module';

// Guards and Interceptors
import { AuthGuard } from './shared/middlewares/auth.guard';
import { LoggingInterceptor } from './shared/middlewares/interceptors/logging.interceptor';

// Services
import { ErrorHandlerService } from './shared/services/errorHandler.service';

/**
 * Root Application Module
 * Orchestrates all feature modules and global providers
 */
@Module({
  imports: [
    // Configuration
    initEnvironmentNest(),

    // Database
    TypeOrmModule.forRootAsync(initPostgres()),

    // Bull Queue with Redis
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_HOST_PORT || '6379', 10),
          db: parseInt(process.env.REDIS_HOST_DB || '0', 10),
          password: process.env.REDIS_HOST_PASSWORD || undefined,
          tls: process.env.REDIS_HOST_SSL === 'true' ? {} : undefined,
        },
      }),
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 10, // 10 requests
      },
    ]),

    // HTTP Module
    HttpModule.registerAsync({
      useClass: HttpConfigService,
    }),

    // Feature Modules
    BaseModule,
    CommonModule,
    AuthenticationModule,
    CustomersModule,
    BrandsModule,
    PostsModule,
    PostAttachmentsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Global Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // Global Guard
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    // Services
    ErrorHandlerService,
  ],
  exports: [HttpModule, ErrorHandlerService],
})
export class AppModule {}
