import { Injectable } from '@nestjs/common';
import { IResponse } from './shared/interfaces/common.interface';

/**
 * Root Application Service
 * Provides application-level business logic
 */
@Injectable()
export class AppService {
    /**
     * Get application information
     * @returns Application metadata
     */
    getApplicationInfo(): IResponse {
        return {
            success: true,
            message: 'NestJS Microservice Base Repository',
            data: {
                name: 'resolve-360-unified',
                version: '1.0.0',
                description: 'Production-ready NestJS microservice base',
                environment: process.env.NODE_ENV || 'development',
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        };
    }

    /**
     * Example business logic method
     * @param data - Input data
     * @returns Processed result
     */
    processData(data: any): IResponse {
        // Add your business logic here
        return {
            success: true,
            message: 'Data processed successfully',
            data: {
                processed: true,
                input: data,
                timestamp: new Date().toISOString(),
            },
        };
    }
}
