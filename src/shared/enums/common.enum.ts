/**
 * Common enumerations used across the application
 */

/**
 * User status enumeration
 */
export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    DELETED = 'deleted',
}

/**
 * Request status enumeration
 */
export enum RequestStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

/**
 * Environment enumeration
 */
export enum Environment {
    DEVELOPMENT = 'dev',
    QA = 'qa',
    UAT = 'uat',
    PRODUCTION = 'prod',
}
