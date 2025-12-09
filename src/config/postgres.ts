import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

/**
 * TypeORM PostgreSQL configuration
 * Reads connection details from environment variables
 * Creates separate pg-pool instance for raw queries
 */

// Create a separate pg-pool instance for raw queries and streaming
export const createPgPool = (): Pool => {
    return new Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'resolve_360_db',
        ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
};

/**
 * Initialize TypeORM with async configuration
 * This function is called in AppModule imports
 * 
 * @returns TypeORM module configured for PostgreSQL
 */
export const initPostgres = (): TypeOrmModuleAsyncOptions => {
    return {
        useFactory: async (configService: ConfigService) => {
            const entities = await import('../entities');

            return {
                type: 'postgres',
                host: configService.get('POSTGRES_HOST', 'localhost'),
                port: configService.get('POSTGRES_PORT', 5432),
                username: configService.get('POSTGRES_USER', 'postgres'),
                password: configService.get('POSTGRES_PASSWORD', 'postgres'),
                database: configService.get('POSTGRES_DB', 'resolve_360_db'),
                entities: Object.values(entities),
                synchronize: false, // CRITICAL: Never set to true in production
                logging: process.env.NODE_ENV === 'dev' ? ['error', 'warn'] : false,
                ssl: configService.get('SSL', 'false') === 'true' ? { rejectUnauthorized: false } : false,
                poolSize: 10,
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 2000,
                },
            };
        },
        inject: [ConfigService],
    };
};
