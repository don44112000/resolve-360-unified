import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Authorization } from '../../../entities/Authorizations/authorization.entity';
import { RequestDTO } from '../dtos/requestDTO';

/**
 * Authorization Service
 * Handles authorization data operations with transaction support
 */
@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);

  constructor(
    @InjectRepository(Authorization)
    private readonly authorizationRepository: Repository<Authorization>,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('AuthorizationService initialized');
  }

  async createAuthorization(
    body: RequestDTO,
    transactionManager?: EntityManager,
  ): Promise<Authorization> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const authorization = manager.create(Authorization, {
        password: body.password,
        otp: '6666', //body.otp,
        accessLevel: body.accessLevel,
      });

      const savedAuthorization = await manager.save(Authorization, authorization);

      this.logger.log(`Authorization created successfully with ID: ${savedAuthorization.id}`);
      return savedAuthorization;
    } catch (error) {
      this.logger.error('Error creating authorization:', error);
      throw error;
    }
  }

  async getAuthorizationById(
    id: string,
    transactionManager?: EntityManager,
  ): Promise<Authorization | null> {
    const manager = transactionManager || this.dataSource.manager;
    return manager.findOne(Authorization, { where: { id } });
  }
}
