import { Injectable, Logger } from '@nestjs/common';

/**
 * Common Service
 * Provides shared functionality used across feature modules
 */
@Injectable()
export class CommonService {
    private readonly logger = new Logger(CommonService.name);

    constructor() {
        this.logger.log('CommonService initialized');
    }

    /**
     * Example utility method
     * @param message - Message to log
     */
    logMessage(message: string): void {
        this.logger.log(message);
    }

    /**
     * Example data transformation method
     * @param data - Data to transform
     * @returns Transformed data
     */
    transformData(data: any): any {
        // Add common transformation logic here
        return data;
    }

    /**
     * Example validation method
     * @param value - Value to validate
     * @returns Boolean indicating validity
     */
    isValid(value: any): boolean {
        // Add common validation logic here
        return value !== null && value !== undefined;
    }
}
