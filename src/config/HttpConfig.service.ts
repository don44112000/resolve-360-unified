import { Injectable } from '@nestjs/common';
import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';

/**
 * HTTP Configuration Service for Axios
 * Provides consistent HTTP client configuration across the application
 */
@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): HttpModuleOptions {
        return {
            timeout: 15000, // 15 seconds
            maxRedirects: 5,
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
}
