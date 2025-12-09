import { ConfigModule } from '@nestjs/config';
import { loadEnvFromConfigService } from './config';
import * as dotenv from 'dotenv';

// Load .env file for local development
dotenv.config();

/**
 * Initialize NestJS ConfigModule with external config service integration
 * This function is called in AppModule imports
 * 
 * @returns ConfigModule configured for async initialization
 */
export const initEnvironmentNest = () => {
    return ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        load: [
            async () => {
                // Load configuration from external service or .env file
                const config = await loadEnvFromConfigService();
                return config;
            },
        ],
    });
};
