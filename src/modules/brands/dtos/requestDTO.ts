import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsNumber,
  IsObject,
} from 'class-validator';

export class CreateBrandDTO {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  displayName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  shortName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  primaryDomain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  primaryEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  primaryCountryCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  primaryPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  contactMeta?: Record<string, any>;
}

export class CreateBrandByUserDTO {
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
