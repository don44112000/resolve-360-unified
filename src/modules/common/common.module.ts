import { Module } from '@nestjs/common';
import { CommonService } from './common.service';

/**
 * Common Module
 * Provides shared services and functionality
 */
@Module({
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule { }
