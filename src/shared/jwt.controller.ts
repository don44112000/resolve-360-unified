import { Controller, Post, HttpCode, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtService } from 'src/shared/services/jwt.service';
import { IResponse } from 'src/shared/interfaces/common.interface';

/**
 * JWT Controller
 * Thin controller that handles HTTP concerns (cookies, request/response)
 * Business logic is in JwtService
 */
@ApiTags('JWT')
@Controller('jwt')
export class JwtController {
  constructor(private jwtService: JwtService) {}

  /**
   * Refresh access token endpoint
   * Handles HTTP-only cookie reading/setting
   */
  @Post('refresh/customer-token')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Refresh access token (with rotation)',
    description:
      'Reads refresh token from cookie, validates it, rotates the token, and returns new access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
    schema: {
      example: {
        success: true,
        message: 'Access token refreshed successfully',
        data: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid, expired, or revoked refresh token' })
  async refreshToken(@Req() req: Request, @Res() res: Response): Promise<any> {
    // Read refresh token from HTTP-only cookie
    const refreshToken = req.cookies['refreshToken'];

    // Call service to handle business logic
    const { accessToken, refreshToken: newRefreshToken } = await this.jwtService.refreshAccessToken(
      refreshToken,
      'customer',
    );

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    // Return new access token
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: { accessToken },
    });
  }

  /**
   * Logout endpoint
   * Handles cookie clearing
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Logout user',
    description: 'Revokes refresh token in database and clears cookie',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
    schema: {
      example: {
        success: true,
        message: 'Logged out successfully',
        data: null,
      },
    },
  })
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    // Read refresh token from cookie
    const refreshToken = req.cookies['refreshToken'];

    // Call service to handle business logic (revoke in DB)
    await this.jwtService.logout(refreshToken);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Return success
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  }
}
