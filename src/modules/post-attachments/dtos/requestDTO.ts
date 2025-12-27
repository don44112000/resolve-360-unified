import {
  IsString,
  IsOptional,
  MaxLength,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  IsEnum,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttachmentFileType } from '../../../shared/enums/common.enum';

export class AttachmentDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fileName: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEnum(AttachmentFileType)
  fileType: AttachmentFileType;
}

export class LinkMediaDTO extends AttachmentDTO {
  // PostId is required if commentId is not provided
  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.commentId)
  @IsNotEmpty({ message: 'postId is required when commentId is not provided' })
  @IsString()
  postId?: string;

  // CommentId is required if postId is not provided
  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.postId)
  @IsNotEmpty({ message: 'commentId is required when postId is not provided' })
  @IsString()
  commentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
