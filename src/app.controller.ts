import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IResponse } from './shared/interfaces/common.interface';

/**
 * Root Application Controller
 * Provides basic application information endpoints
 */
@ApiTags('Application')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    /**
     * Root endpoint
     * Returns application information
     */
    @Get()
    @ApiOperation({ summary: 'Get application information' })
    getInfo(): IResponse {
        return this.appService.getApplicationInfo();
    }

    /**
     * Example protected endpoint
     * Requires authentication via AuthGuard
     */
    @Get('protected')
    @ApiOperation({ summary: 'Protected endpoint example' })
    getProtected(): IResponse {
        return {
            success: true,
            message: 'This is a protected endpoint',
            data: {
                timestamp: new Date().toISOString(),
            },
        };
    }
}
