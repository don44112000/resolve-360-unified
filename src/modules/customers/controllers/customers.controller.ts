import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from '../services/customers.service';
import { createCustomerDTO, customerPasswordLoginDTO } from '../dtos/requestDTO';

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

  @Post('customer-password-login')
  async customerPasswordLogin(@Body() body: customerPasswordLoginDTO, @Res() res) {
    try {
      const customer = await this.customersService.customerPasswordLogin(body);

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', customer.refreshToken, {
        httpOnly: true, // Prevent JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days in milliseconds
      });

      // Return only customer data and access token in JSON
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Customer logged in successfully',
        data: customer.data,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to log in customer',
        error: error.message,
        success: false,
      });
    }
  }
}
