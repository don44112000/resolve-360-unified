import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
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

    // Swagger/OpenAPI documentation
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

    // Enable graceful shutdown
    app.enableShutdownHooks();

    // Start listening
    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 Swagger documentation available at: http://localhost:${port}/api`);
    logger.log(`🏥 Health check available at: http://localhost:${port}/health`);
    logger.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
