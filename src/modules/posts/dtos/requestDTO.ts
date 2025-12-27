import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { AttachmentDTO } from '../../post-attachments/dtos/requestDTO';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  customerRefId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  brandRefId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDTO)
  postAttachments?: AttachmentDTO[];
}

export class SavePostDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  brandId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isEdited?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
