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
 */
export interface IJwtPayload {
    userId?: string;
    email?: string;
    type?: 'session' | 'web';
    iat?: number;
    exp?: number;
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
