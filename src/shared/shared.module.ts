import { Module, Global } from '@nestjs/common';
import { ErrorHandlerService } from './services/errorHandler.service';
import { S3Service } from './services/s3.service';
import { JwtService } from './services/jwt.service';
import { SharedController } from './shared.controller';
import { JwtController } from './jwt.controller';
import { AuthenticationModule } from '../modules/authentication/authentication.module';

/**
 * Shared Module
 * Exports common services used across the application
 */
@Global()
@Module({
  imports: [AuthenticationModule], // Import to access AuthenticationService
  controllers: [SharedController, JwtController],
  providers: [ErrorHandlerService, S3Service, JwtService],
  exports: [ErrorHandlerService, S3Service, JwtService],
})
export class SharedModule {}
