import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../entities/Customers/customer.entity';
import { CustomersService } from './services/customers.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CustomersController } from './controllers/customers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AuthenticationModule],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
