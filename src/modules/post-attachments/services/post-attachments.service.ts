import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { PostAttachment } from '../../../entities/PostAttachments/post-attachment.entity';
import { LinkMediaDTO } from '../dtos/requestDTO';

@Injectable()
export class PostAttachmentsService {
  private readonly logger = new Logger(PostAttachmentsService.name);

  constructor(
    @InjectRepository(PostAttachment)
    private readonly postAttachmentRepository: Repository<PostAttachment>,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('PostAttachmentsService initialized');
  }

  async linkMedia(body: LinkMediaDTO, transactionManager?: EntityManager): Promise<PostAttachment> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const postAttachment = manager.create(PostAttachment, {
        postId: body.postId || null,
        commentId: body.commentId || null,
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileType: body.fileType,
        isPublic: body.isPublic ?? true,
        meta: body.meta || null,
        isDeleted: false,
      });

      const savedAttachment = await manager.save(PostAttachment, postAttachment);
      this.logger.log(`Post attachment created successfully with ID: ${savedAttachment.id}`);
      return savedAttachment;
    } catch (error) {
      this.logger.error('Error creating post attachment:', error);
      throw error;
    }
  }
}
