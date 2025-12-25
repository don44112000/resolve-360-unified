/**
 * Common interfaces used across the application
 */

/**
 * Standard API response format
 * All controller methods should return this format
 */
export interface IResponse<T = any> {
  message: string;
  data: T;
  success: boolean;
}

/**
 * JWT token payload interface
 * Contains only the user reference ID for simplicity
 */
export interface IJwtPayload {
  userRefId: string;
  iat?: number; // Issued at timestamp
  exp?: number; // Expiration timestamp
}

/**
 * Token pair interface (access + refresh tokens)
 */
export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Pagination metadata interface
 */
export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated response interface
 */
export interface IPaginatedResponse<T = any> extends IResponse<T[]> {
  meta: IPaginationMeta;
}
