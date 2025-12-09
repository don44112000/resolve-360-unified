import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

/**
 * Logging Interceptor
 * Logs all incoming requests and outgoing responses
 * Tracks correlation IDs and request duration
 * Also serves as an exception filter for error handling
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const { method, url, body, headers } = request;
        const startTime = Date.now();

        // Generate or extract correlation ID
        const correlationId = headers['x-correlation-id'] || uuidv4();

        // Add correlation ID to response headers
        response.setHeader('x-correlation-id', correlationId);

        // Log incoming request
        this.logger.log(
            `[${correlationId}] Incoming Request: ${method} ${url} | Body: ${JSON.stringify(body)}`,
        );

        return next.handle().pipe(
            tap((data) => {
                // Log successful response
                const duration = Date.now() - startTime;
                this.logger.log(
                    `[${correlationId}] Response: ${method} ${url} | Status: ${response.statusCode} | Duration: ${duration}ms`,
                );
            }),
            catchError((error) => {
                // Log error response
                const duration = Date.now() - startTime;
                const status = error instanceof HttpException
                    ? error.getStatus()
                    : HttpStatus.INTERNAL_SERVER_ERROR;

                this.logger.error(
                    `[${correlationId}] Error: ${method} ${url} | Status: ${status} | Duration: ${duration}ms | Error: ${error.message}`,
                );

                // Format error response
                const errorResponse = {
                    success: false,
                    message: error.message || 'Internal server error',
                    error: error.name || 'Error',
                    statusCode: status,
                    correlationId,
                    timestamp: new Date().toISOString(),
                };

                return throwError(() => new HttpException(errorResponse, status));
            }),
        );
    }
}
