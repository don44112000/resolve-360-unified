import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HealthCheck,
    TypeOrmHealthIndicator,
    DiskHealthIndicator,
    MemoryHealthIndicator,
} from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

/**
 * Base Controller
 * Provides health check endpoints for application monitoring
 * Used by Kubernetes and monitoring systems
 */
@ApiTags('Health')
@Controller()
export class BaseController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private disk: DiskHealthIndicator,
        private memory: MemoryHealthIndicator,
    ) { }

    /**
     * Basic health check endpoint
     * Returns simple application status
     */
    @Get('health')
    @HealthCheck()
    @ApiOperation({ summary: 'Basic health check' })
    check() {
        return this.health.check([
            // Basic application health
            () => ({ app: { status: 'up' } }),
        ]);
    }

    /**
     * Readiness probe for Kubernetes
     * Checks if application is ready to receive traffic
     * Validates database connection, disk space, and memory
     */
    @Get('readiness')
    @HealthCheck()
    @ApiOperation({ summary: 'Kubernetes readiness probe' })
    readiness() {
        return this.health.check([
            // Database connectivity
            () => this.db.pingCheck('database'),

            // Disk storage check (70% threshold)
            () => this.disk.checkStorage('storage', {
                path: '/',
                thresholdPercent: 0.7,
            }),

            // Memory heap check (150MB threshold)
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
        ]);
    }

    /**
     * Liveness probe for Kubernetes
     * Checks if application is alive and should not be restarted
     */
    @Get('liveness')
    @HealthCheck()
    @ApiOperation({ summary: 'Kubernetes liveness probe' })
    liveness() {
        return this.health.check([
            // Basic liveness check
            () => ({ app: { status: 'up' } }),
        ]);
    }
}
