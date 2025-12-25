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

/**
 * User role enumeration
 */
export enum UserRole {
  INTERNAL = 'internal',
  BRAND = 'brand',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

/**
 * Brand status enumeration
 */
export enum BrandStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
}

/**
 * Brand user role enumeration
 */
export enum BrandUserRole {
  AGENT = 'agent',
  MANAGER = 'manager',
  ADMIN = 'admin',
  OWNER = 'owner',
}

/**
 * Post status enumeration
 */
export enum PostStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  RESPONDED = 'responded',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

/**
 * Post priority enumeration
 */
export enum PostPriority {
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Comment author type enumeration
 */
export enum CommentAuthorType {
  CUSTOMER = 'customer',
  USER = 'user',
}

/**
 * Attachment file type enumeration
 */
export enum AttachmentFileType {
  IMAGE = 'image',
  PDF = 'pdf',
  VIDEO = 'video',
  OTHER = 'other',
}
