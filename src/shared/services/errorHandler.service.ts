import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';

/**
 * Centralized error handling service
 * Provides consistent error logging and HTTP exception throwing
 */
@Injectable()
export class ErrorHandlerService {
    private readonly logger = new Logger(ErrorHandlerService.name);

    /**
     * Handle and log errors consistently
     * @param error - The error object or message
     * @param context - Context where error occurred (e.g., method name)
     * @param statusCode - HTTP status code (default: 500)
     */
    handleError(
        error: any,
        context: string,
        statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    ): never {
        const errorMessage = error?.message || error || 'An unexpected error occurred';

        // Log the error with context
        this.logger.error(`[${context}] ${errorMessage}`, error?.stack);

        // Throw HTTP exception
        throw new HttpException(
            {
                success: false,
                message: errorMessage,
                error: error?.name || 'Error',
                statusCode,
            },
            statusCode,
        );
    }

    /**
     * Log error without throwing
     * @param error - The error object or message
     * @param context - Context where error occurred
     */
    logError(error: any, context: string): void {
        const errorMessage = error?.message || error || 'An error occurred';
        this.logger.error(`[${context}] ${errorMessage}`, error?.stack);
    }

    /**
     * Log warning
     * @param message - Warning message
     * @param context - Context where warning occurred
     */
    logWarning(message: string, context: string): void {
        this.logger.warn(`[${context}] ${message}`);
    }

    /**
     * Log info
     * @param message - Info message
     * @param context - Context
     */
    logInfo(message: string, context: string): void {
        this.logger.log(`[${context}] ${message}`);
    }
}
