import { IsString, IsOptional, IsDate, IsBoolean } from 'class-validator';

export class RequestDTO {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsString()
  refreshTokenHash?: string;

  @IsOptional()
  @IsDate()
  refreshTokenExpiresAt?: Date;

  @IsOptional()
  @IsBoolean()
  refreshTokenRevoked?: boolean;
}
