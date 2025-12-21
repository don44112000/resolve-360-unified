import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MaxLength, IsNotEmpty, IsNumber } from 'class-validator';

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
  logoUrl?: string;

  @IsOptional()
  contactMeta?: Record<string, any>;
}

export class createBrandByUserDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  displayName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  primaryDomain: string;
}

export class SearchBrandDTO {
  @ApiProperty({ required: true })
  @IsString()
  searchKey: string;

  @ApiProperty({ required: false, default: 25 })
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  page?: number;
}
