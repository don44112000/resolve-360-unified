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
import { AttachmentFileType } from '../../../shared/enums/common.enum';

export class attachmentDTO {
  @IsNotEmpty()
  @IsString()
  fileUrl: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  fileName: string;

  @IsNotEmpty()
  @IsEnum(AttachmentFileType)
  fileType: AttachmentFileType;
}

export class LinkMediaDTO extends attachmentDTO {
  // PostId is required if commentId is not provided
  @ValidateIf((o) => !o.commentId)
  @IsNotEmpty({ message: 'postId is required when commentId is not provided' })
  @IsString()
  postId?: string;

  // CommentId is required if postId is not provided
  @ValidateIf((o) => !o.postId)
  @IsNotEmpty({ message: 'commentId is required when postId is not provided' })
  @IsString()
  commentId?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;
}
