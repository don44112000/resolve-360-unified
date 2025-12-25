import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for generating JWT tokens
 * Used when creating new tokens during login/signup
 */
export class GenerateTokenDto {
  @ApiProperty({
    description: 'User Reference ID',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  @IsString()
  @IsNotEmpty()
  userRefId: string;
}

/**
 * DTO for refreshing tokens
 * Used to obtain new access tokens using a refresh token
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

/**
 * DTO for verifying tokens
 * Used to validate and decode tokens
 */
export class VerifyTokenDto {
  @ApiProperty({
    description: 'JWT token to verify',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

/**
 * DTO for logout
 * Optional: Can include refresh token for server-side invalidation
 */
export class LogoutDto {
  @ApiProperty({
    description: 'Refresh token to invalidate (optional)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
