import { SetMetadata } from '@nestjs/common';

/**
 * Metadata key for internal request decorator
 */
export const IS_INTERNAL_REQUEST_KEY = 'isInternalRequest';

/**
 * Custom decorator to mark endpoints as internal-only
 * These endpoints require x-api-key header validation
 * 
 * Usage:
 * @InternalRequest()
 * @Get('internal-endpoint')
 * async internalMethod() { ... }
 */
export const InternalRequest = () => SetMetadata(IS_INTERNAL_REQUEST_KEY, true);
