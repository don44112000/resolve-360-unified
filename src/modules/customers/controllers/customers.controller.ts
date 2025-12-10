import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from '../services/customers.service';
import { createCustomerDTO } from '../dtos/requestDTO';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('create-customer')
  async createCustomer(@Body() body: createCustomerDTO, @Res() res) {
    try {
      const result = await this.customersService.createCustomerWithTransaction(body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Customer created successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create customer',
        error: error.message,
        success: false,
      });
    }
  }
}
