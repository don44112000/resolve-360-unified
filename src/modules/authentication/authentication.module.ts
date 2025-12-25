import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authentication } from '../../entities/Authentication/authentication.entity';
import { AuthenticationService } from './services/authentication.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authentication])],
  controllers: [],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
