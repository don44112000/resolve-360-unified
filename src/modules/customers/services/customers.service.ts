import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Customer } from '../../../entities/Customers/customer.entity';
import { createCustomerDTO, customerPasswordLoginDTO } from '../dtos/requestDTO';
import { AuthenticationService } from '../../authentication/services/authentication.service';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly authenticationService: AuthenticationService,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('CustomersService initialized');
  }

  async createCustomer(
    body: createCustomerDTO,
    transactionManager?: EntityManager,
  ): Promise<Customer> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const authPayload = {
        password: body.password,
        otp: '6666',
      };
      const saveAuth = await this.authenticationService.createAuthentication(authPayload, manager);
      const customer = manager.create(Customer, {
        authId: saveAuth.id,
        name: body.name,
        email: body.email,
        countryCode: body.countryCode,
        phone: body.phone,
        isVerified: false,
        isActive: true,
      });
      const savedCustomer = await manager.save(Customer, customer);
      this.logger.log(`Customer created successfully with ID: ${savedCustomer.id}`);
      return savedCustomer;
    } catch (error) {
      this.logger.error('Error creating customer:', error);
      throw error;
    }
  }

  async findCustomerByEmail(email: string, transactionManager?: EntityManager): Promise<Customer> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const customer = await manager.findOne(Customer, { where: { email } });
      return customer;
    } catch (error) {
      this.logger.error('Error finding customer by email:', error);
      throw error;
    }
  }

  async findCustomerByPhone(
    phone: string,
    countryCode: string,
    transactionManager?: EntityManager,
  ): Promise<Customer> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const customer = await manager.findOne(Customer, { where: { phone, countryCode } });
      return customer;
    } catch (error) {
      this.logger.error('Error finding customer by phone:', error);
      throw error;
    }
  }

  async findCustomerByEmailOrPhone(
    email?: string,
    phone?: string,
    countryCode?: string,
    transactionManager?: EntityManager,
  ): Promise<Customer> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const whereConditions = [];
      if (email) {
        whereConditions.push({ email });
      }
      if (phone && countryCode) {
        whereConditions.push({ phone, countryCode });
      }
      if (whereConditions.length === 0) {
        return null;
      }
      const customer = await manager.findOne(Customer, { where: whereConditions });
      return customer;
    } catch (error) {
      this.logger.error('Error finding customer by email or phone:', error);
      throw error;
    }
  }

  async findCustomerByRefId(refId: string, transactionManager?: EntityManager): Promise<Customer> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const customer = await manager.findOne(Customer, { where: { refId } });
      return customer;
    } catch (error) {
      this.logger.error('Error finding customer by refId:', error);
      throw error;
    }
  }

  async createCustomerWithTransaction(body: createCustomerDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.createCustomer(body, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result.refId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async customerPasswordLogin(body: customerPasswordLoginDTO): Promise<any> {
    try {
      const customer = await this.findCustomerByEmailOrPhone(
        body.email ?? null,
        body.phone ?? null,
        body.countryCode ?? null,
      );
      if (!customer) {
        throw new Error('Customer not found');
      }
      const auth = await this.authenticationService.getAuthenticationById(customer.authId);
      if (!auth) {
        throw new Error('Authentication not found');
      }
      if (auth.password !== body.password) {
        throw new Error('Invalid password');
      }
      return {
        refId: customer.refId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        countryCode: customer.countryCode,
      };
    } catch (error) {
      this.logger.error('Error logging in customer:', error);
      throw error;
    }
  }
}
