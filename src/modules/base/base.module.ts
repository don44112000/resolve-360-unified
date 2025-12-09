import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { BaseController } from './base.controller';

/**
 * Base Module
 * Provides health check functionality
 */
@Module({
    imports: [TerminusModule],
    controllers: [BaseController],
})
export class BaseModule { }
