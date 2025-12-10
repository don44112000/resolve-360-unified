import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../entities/Customers/customer.entity';
import { CustomersService } from './services/customers.service';
import { AuthorizationModule } from '../authorization/authorization.module';
import { CustomersController } from './controllers/customers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AuthorizationModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
