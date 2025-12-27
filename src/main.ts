import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

/**
 * Bootstrap the NestJS application
 * Configures middleware, security, validation, and Swagger documentation
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security middleware
  app.use(helmet());

  // Cookie parser middleware (required for HTTP-only cookies)
  app.use(cookieParser());

  // Compression middleware
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: true, // Allow all origins (configure for production)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Get port early so it can be used in Swagger docs
  const port = process.env.PORT || 3000;

  // Swagger/OpenAPI documentation
  // Only enable in non-production environments for security

  const isDev = process.env.NODE_ENV === 'dev';

  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('Resolve 360 Unified API')
      .setDescription('Production-ready NestJS microservice base repository')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
        'JWT',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
          description: 'API key for internal microservice communication',
        },
        'API-Key',
      )
      .addServer('http://localhost:3000', 'Local Development')
      .addServer('https://dev-api.example.com', 'Development')
      .addServer('https://qa-api.example.com', 'QA')
      .addServer('https://uat-api.example.com', 'UAT')
      .addServer('https://api.example.com', 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
  } else {
    logger.log(`🔒 Swagger documentation is disabled in production for security`);
  }

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Start listening
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
  logger.log(`🏥 Health check available at: http://localhost:${port}/health`);
  logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
