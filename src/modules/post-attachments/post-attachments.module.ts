import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostAttachment } from '../../entities/PostAttachments/post-attachment.entity';
import { PostAttachmentsService } from './services/post-attachments.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostAttachment])],
  providers: [PostAttachmentsService],
  exports: [PostAttachmentsService],
})
export class PostAttachmentsModule {}
