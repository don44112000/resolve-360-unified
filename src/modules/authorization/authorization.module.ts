import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authorization } from '../../entities/Authorizations/authorization.entity';
import { AuthorizationService } from './services/authorization.service';

@Module({
  imports: [TypeOrmModule.forFeature([Authorization])],
  controllers: [],
  providers: [AuthorizationService],
  exports: [AuthorizationService],
})
export class AuthorizationModule {}
