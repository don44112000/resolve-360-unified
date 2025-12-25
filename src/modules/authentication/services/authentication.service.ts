import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Authentication } from '../../../entities/Authentication/authentication.entity';
import { RequestDTO } from '../dtos/requestDTO';

/**
 * Authentication Service
 * Handles authentication data operations with transaction support
 */
@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectRepository(Authentication)
    private readonly authenticationRepository: Repository<Authentication>,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('AuthenticationService initialized');
  }

  async createAuthentication(
    body: RequestDTO,
    transactionManager?: EntityManager,
  ): Promise<Authentication> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const authentication = manager.create(Authentication, {
        password: body.password,
        otp: '6666', //body.otp,
      });

      const savedAuthentication = await manager.save(Authentication, authentication);

      this.logger.log(`Authentication created successfully with ID: ${savedAuthentication.id}`);
      return savedAuthentication;
    } catch (error) {
      this.logger.error('Error creating authorization:', error);
      throw error;
    }
  }

  async getAuthenticationById(
    id: string,
    transactionManager?: EntityManager,
  ): Promise<Authentication | null> {
    const manager = transactionManager || this.dataSource.manager;
    return manager.findOne(Authentication, { where: { id } });
  }
}
