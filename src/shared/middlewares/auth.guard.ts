import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_INTERNAL_REQUEST_KEY } from './internal-request.decorator';
import { IJwtPayload } from '../interfaces/common.interface';

/**
 * Authentication Guard
 * Validates JWT tokens (session and web) and API keys for internal microservice communication
 * Supports public routes that don't require authentication
 */
@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const path = request.path || request.url;

        // Public routes that don't require authentication
        const publicRoutes = ['/', '/health', '/readiness', '/liveness', '/api'];

        if (publicRoutes.some((route) => path.startsWith(route))) {
            return true;
        }

        // Check if route is marked as internal-only
        const isInternalRequest = this.reflector.getAllAndOverride<boolean>(
            IS_INTERNAL_REQUEST_KEY,
            [context.getHandler(), context.getClass()],
        );

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
     * Validate JWT token (session or web)
     * Supports two token types:
     * 1. Session token (mobile/app) - JWT_SESSION_SECRET
     * 2. Web token (web applications) - JWT_SECRET
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
            // Try validating with session secret first
            let decoded: IJwtPayload;

            try {
                decoded = jwt.verify(token, process.env.JWT_SESSION_SECRET) as IJwtPayload;
                decoded.type = 'session';
            } catch (sessionError) {
                // If session validation fails, try web secret
                try {
                    decoded = jwt.verify(token, process.env.JWT_SECRET) as IJwtPayload;
                    decoded.type = 'web';
                } catch (webError) {
                    this.logger.warn('JWT validation failed with both secrets');
                    throw new UnauthorizedException('Invalid or expired token');
                }
            }

            // Attach decoded token to request for use in controllers
            request.user = decoded;

            return true;
        } catch (error) {
            this.logger.error('JWT validation error:', error.message);
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
