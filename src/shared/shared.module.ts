import { Module, Global } from '@nestjs/common';
import { ErrorHandlerService } from './services/errorHandler.service';
import { S3Service } from './services/s3.service';

/**
 * Shared Module
 * Exports common services used across the application
 */
@Global()
@Module({
    providers: [ErrorHandlerService, S3Service],
    exports: [ErrorHandlerService, S3Service],
})
export class SharedModule { }
