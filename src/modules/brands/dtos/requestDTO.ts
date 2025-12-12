import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class createBrandDTO {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  shortName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  primaryDomain?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  primaryEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  primaryCountryCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  primaryPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  contactMeta?: Record<string, any>;
}
