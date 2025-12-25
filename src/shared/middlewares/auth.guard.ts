import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_INTERNAL_REQUEST_KEY } from './internal-request.decorator';
import { IJwtPayload } from '../interfaces/common.interface';
import { JwtService } from '../services/jwt.service';

/**
 * Authentication Guard
 * Validates JWT tokens and API keys for internal microservice communication
 * Supports public routes that don't require authentication
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.path || request.url;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/health', '/readiness', '/liveness', '/api'];

    if (publicRoutes.some((route) => path.startsWith(route))) {
      return true;
    }

    // Check if route is marked as internal-only
    const isInternalRequest = this.reflector.getAllAndOverride<boolean>(IS_INTERNAL_REQUEST_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isInternalRequest) {
      return this.validateApiKey(request);
    }

    // Validate JWT token
    return this.validateJwtToken(request);
  }

  /**
   * Validate API key for internal microservice communication
   * Expects x-api-key header
   */
  private validateApiKey(request: any): boolean {
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      this.logger.warn('Missing x-api-key header for internal request');
      throw new UnauthorizedException('API key is required for internal requests');
    }

    const validApiKey = process.env.EXTERNAL_MICROSERVICE_API_KEY;

    if (apiKey !== validApiKey) {
      this.logger.warn('Invalid API key provided');
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }

  /**
   * Validate JWT token
   * Verifies the token and attaches the user info to the request
   */
  private validateJwtToken(request: any): boolean {
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      this.logger.warn('Missing authorization header');
      throw new UnauthorizedException('Authorization token is required');
    }

    // Extract token from 'Bearer <token>' format
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      // Verify token and attach decoded payload to request
      const decoded: IJwtPayload = this.jwtService.verifyToken(token);
      request.user = decoded;

      return true;
    } catch (error) {
      this.logger.error('JWT validation error:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
