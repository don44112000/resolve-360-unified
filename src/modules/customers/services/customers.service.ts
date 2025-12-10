import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Customer } from '../../../entities/Customers/customer.entity';
import { createCustomerDTO } from '../dtos/requestDTO';
import { AuthorizationService } from '../../authorization/services/authorization.service';
import { AccessLevel } from '../../../shared/enums/common.enum';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly authorizationService: AuthorizationService,
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
        accessLevel: AccessLevel.CUSTOMER,
      };
      const saveAuth = await this.authorizationService.createAuthorization(authPayload, manager);
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
}
