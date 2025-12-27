import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationRequestDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  otp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  refreshTokenHash?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  refreshTokenExpiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  refreshTokenRevoked?: boolean;
}
