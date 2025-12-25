import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource, MoreThan } from 'typeorm';
import { Authentication } from '../../../entities/Authentication/authentication.entity';
import { RequestDTO } from '../dtos/requestDTO';
import { Customer, User } from 'src/entities';

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

  async storeRefreshToken(
    authId: string,
    tokenHash: string,
    expiresAt: Date,
    transactionManager?: EntityManager,
  ): Promise<void> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      await manager.update(Authentication, authId, {
        refreshTokenHash: tokenHash,
        refreshTokenExpiresAt: expiresAt,
        refreshTokenRevoked: false,
      });

      this.logger.log(`Refresh token stored for auth ID: ${authId}`);
    } catch (error) {
      this.logger.error('Error storing refresh token:', error);
      throw error;
    }
  }

  async revokeRefreshToken(authId: string, transactionManager?: EntityManager): Promise<void> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      await manager.update(Authentication, authId, {
        refreshTokenRevoked: true,
        refreshTokenExpiresAt: null,
        refreshTokenHash: null,
      });

      this.logger.log(`Refresh token revoked for auth ID: ${authId}`);
    } catch (error) {
      this.logger.error('Error revoking refresh token:', error);
      throw error;
    }
  }

  async getAuthByRefreshToken(
    tokenHash: string,
    transactionManager?: EntityManager,
  ): Promise<Authentication | null> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const auth = await manager.findOne(Authentication, {
        where: { refreshTokenHash: tokenHash },
      });

      return auth;
    } catch (error) {
      this.logger.error('Error finding auth by refresh token:', error);
      return null;
    }
  }

  async getActiveAuthAndCustomerByRefreshToken(
    tokenHash: string,
    transactionManager?: EntityManager,
  ): Promise<Authentication | null> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const auth = await manager.findOne(Authentication, {
        where: {
          refreshTokenHash: tokenHash,
          refreshTokenRevoked: false,
          refreshTokenExpiresAt: MoreThan(new Date()), // Token must not be expired
        },
        relations: ['customer'],
      });

      return auth;
    } catch (error) {
      this.logger.error('Error finding auth by refresh token:', error);
      return null;
    }
  }

  async getActiveAuthAndUserByRefreshToken(
    tokenHash: string,
    transactionManager?: EntityManager,
  ): Promise<Authentication | null> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const auth = await manager.findOne(Authentication, {
        where: {
          refreshTokenHash: tokenHash,
          refreshTokenRevoked: false,
          refreshTokenExpiresAt: MoreThan(new Date()),
        },
        relations: ['user'],
      });

      return auth;
    } catch (error) {
      this.logger.error('Error finding auth by refresh token:', error);
      return null;
    }
  }

  async getCustomerByAuthId(
    authId: string,
    transactionManager?: EntityManager,
  ): Promise<Customer | null> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      // Query using authId column directly
      const customer = await manager.findOne(Customer, {
        where: { authId },
      });

      return customer;
    } catch (error) {
      this.logger.error('Error finding customer by auth ID:', error);
      return null;
    }
  }

  async getUserByAuthId(authId: string, transactionManager?: EntityManager): Promise<User | null> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      // Query using authId column directly
      const user = await manager.findOne(User, {
        where: { authId },
      });

      return user;
    } catch (error) {
      this.logger.error('Error finding user by auth ID:', error);
      return null;
    }
  }
}
