import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import { IJwtPayload } from '../interfaces/common.interface';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';

/**
 * JWT Service
 * Handles JWT access tokens and opaque refresh tokens
 * - Access tokens: Short-lived JWT (15-20 min)
 * - Refresh tokens: Long-lived opaque tokens (14 days, stored in DB)
 */
@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  // Token expiration times
  private readonly ACCESS_TOKEN_EXPIRES_IN = '15m'; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRES_IN_DAYS = 7; // 14 days

  constructor(private authenticationService: AuthenticationService) {}

  /**
   * Generate JWT access token
   * Short-lived token for authenticated API requests (15 minutes)
   * @param userRefId - User reference ID
   * @returns JWT access token string
   */
  generateAccessToken(userRefId: string): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      this.logger.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT configuration error');
    }

    const payload: Omit<IJwtPayload, 'iat' | 'exp'> = { userRefId };

    return jwt.sign(payload, secret, {
      expiresIn: this.ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  /**
   * Generate opaque refresh token
   * Random string (not JWT) that will be stored hashed in database
   * @returns Random 64-character hex string
   */
  generateOpaqueRefreshToken(): string {
    // Generate 32 random bytes (will be 64 hex characters)
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash refresh token for database storage
   * Uses SHA-256 for consistent, fast hashing
   * @param token - Plain refresh token
   * @returns Hashed token
   */
  hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify refresh token against hash
   * @param token - Plain refresh token from cookie
   * @param hash - Hashed token from database
   * @returns true if token matches hash
   */
  verifyRefreshTokenHash(token: string, hash: string): boolean {
    const tokenHash = this.hashRefreshToken(token);
    return tokenHash === hash;
  }

  /**
   * Get refresh token expiration date
   * @returns Date object for token expiration (14 days from now)
   */
  getRefreshTokenExpiration(): Date {
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + this.REFRESH_TOKEN_EXPIRES_IN_DAYS);
    return expiration;
  }

  /**
   * Refresh access token with token rotation
   * Business logic for the refresh flow
   *
   * @param refreshToken - Plain refresh token from cookie
   * @returns Object with new access token and new refresh token
   * @throws UnauthorizedException if token is invalid
   */
  async refreshAccessToken(
    refreshToken: string,
    typeOfUser: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }

      // Hash the incoming token
      const tokenHash = this.hashRefreshToken(refreshToken);

      // Get active auth with customer/user in a single query
      // This checks: token hash matches AND not revoked
      let auth = null;
      let refId = null;
      if (typeOfUser === 'customer') {
        auth = await this.authenticationService.getActiveAuthAndCustomerByRefreshToken(tokenHash);
        refId = auth.customer?.refId || null;
      } else if (typeOfUser === 'user') {
        auth = await this.authenticationService.getActiveAuthAndUserByRefreshToken(tokenHash);
        refId = auth.user?.refId || null;
      }

      if (!auth) {
        this.logger.warn('Invalid refresh token - not found, revoked, or expired');
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token (using auth.refId as userRefId)
      const newAccessToken = this.generateAccessToken(refId);

      // Generate new refresh token (rotation)
      const newRefreshToken = this.generateOpaqueRefreshToken();

      // Hash new refresh token
      const newTokenHash = this.hashRefreshToken(newRefreshToken);

      // Get new expiration date
      const expiresAt = this.getRefreshTokenExpiration();

      // Rotate refresh token in database
      await this.authenticationService.storeRefreshToken(auth.id, newTokenHash, expiresAt);

      this.logger.log(`Tokens refreshed successfully for auth ID: ${auth.id}`);

      // Return new tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      this.logger.error(`Error refreshing access token: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Logout user by revoking refresh token
   * Business logic for logout flow
   *
   * @param refreshToken - Plain refresh token from cookie (optional)
   */
  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      this.logger.warn('Logout called without refresh token');
      return;
    }

    // Hash token to find in database
    const tokenHash = this.hashRefreshToken(refreshToken);

    // Find authentication record
    const auth = await this.authenticationService.getAuthByRefreshToken(tokenHash);

    if (auth) {
      // Mark token as revoked in database
      await this.authenticationService.revokeRefreshToken(auth.id);
      this.logger.log(`User logged out, token revoked for auth ID: ${auth.id}`);
    } else {
      this.logger.warn('Logout: Refresh token not found in database');
    }
  }

  /**
   * Verify JWT access token
   * Validates signature and expiration
   * @param token - JWT token to verify
   * @returns Decoded JWT payload
   * @throws UnauthorizedException if token is invalid or expired
   */
  verifyAccessToken(token: string): IJwtPayload {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      this.logger.error('JWT_SECRET is not defined in environment variables');
      throw new Error('JWT configuration error');
    }

    try {
      return jwt.verify(token, secret) as IJwtPayload;
    } catch (error) {
      this.logger.warn(`Access token verification failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  /**
   * Verify token (generic)
   * Alias for verifyAccessToken for backward compatibility
   * @param token - JWT token to verify
   * @returns Decoded JWT payload
   */
  verifyToken(token: string): IJwtPayload {
    return this.verifyAccessToken(token);
  }

  /**
   * Decode token without verification
   * WARNING: Does not verify signature or expiration!
   * Use only for debugging or informational purposes
   * @param token - JWT token to decode
   * @returns Decoded JWT payload or null if invalid
   */
  decodeToken(token: string): IJwtPayload | null {
    try {
      return jwt.decode(token) as IJwtPayload;
    } catch (error) {
      this.logger.warn(`Token decode failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Check if token is expired
   * Does not throw exceptions
   * @param token - JWT token to check
   * @returns true if expired, false if valid
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
