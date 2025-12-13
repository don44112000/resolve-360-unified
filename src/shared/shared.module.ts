import { Module, Global } from '@nestjs/common';
import { ErrorHandlerService } from './services/errorHandler.service';
import { S3Service } from './services/s3.service';
import { SharedController } from './shared.controller';

/**
 * Shared Module
 * Exports common services used across the application
 */
@Global()
@Module({
  controllers: [SharedController],
  providers: [ErrorHandlerService, S3Service],
  exports: [ErrorHandlerService, S3Service],
})
export class SharedModule {}
