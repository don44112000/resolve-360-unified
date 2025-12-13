import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Post } from '../../../entities/Posts/post.entity';
import { createPostDTO, savePostDTO } from '../dtos/requestDTO';
import { CustomersService } from '../../customers/services/customers.service';
import { BrandsService } from '../../brands/services/brands.service';
import { PostAttachmentsService } from '../../post-attachments/services/post-attachments.service';
import { PostStatus, PostPriority } from '../../../shared/enums/common.enum';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly customersService: CustomersService,
    private readonly brandsService: BrandsService,
    private readonly postAttachmentsService: PostAttachmentsService,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('PostsService initialized');
  }

  async createPost(body: savePostDTO, transactionManager?: EntityManager): Promise<Post> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      // Create the post entity using repository
      const post = this.postRepository.create({
        customerId: body.customerId,
        brandId: body.brandId,
        title: body.title,
        description: body.description || null,
        isPublic: body.isPublic ?? true,
        status: body.status as PostStatus,
        priority: body.priority as PostPriority,
        isVerified: body.isVerified ?? false,
        isEdited: body.isEdited ?? false,
        meta: body.meta || null,
      });

      // Save using manager
      const savedPost = await manager.save(post);
      this.logger.log(`Post created successfully with ID: ${savedPost.id}`);
      return savedPost;
    } catch (error) {
      this.logger.error('Error creating post:', error);
      throw error;
    }
  }

  async createPostWithTransaction(body: createPostDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Look up customer by refId
      const customer = await this.customersService.findCustomerByRefId(
        body.customerRefId,
        queryRunner.manager,
      );
      if (!customer) {
        throw new NotFoundException(`Customer with refId ${body.customerRefId} not found`);
      }

      // Look up brand by refId
      const brand = await this.brandsService.findBrandByRefId(body.brandRefId, queryRunner.manager);
      if (!brand) {
        throw new NotFoundException(`Brand with refId ${body.brandRefId} not found`);
      }

      // Create the post with the found IDs
      const post = await this.createPost(
        {
          customerId: customer.id,
          brandId: brand.id,
          title: body.title,
          description: body.description,
          isPublic: body.isPublic,
          status: PostStatus.OPEN,
          priority: PostPriority.NORMAL,
          isVerified: false,
          isEdited: false,
          meta: null,
        },
        queryRunner.manager,
      );

      // If post attachments are provided, create them
      if (body.postAttachments && body.postAttachments.length > 0) {
        for (const attachment of body.postAttachments) {
          await this.postAttachmentsService.linkMedia(
            {
              postId: post.id,
              fileUrl: attachment.fileUrl,
              fileName: attachment.fileName,
              fileType: attachment.fileType,
              isPublic: body.isPublic ?? true,
            },
            queryRunner.manager,
          );
        }
        this.logger.log(`Created ${body.postAttachments.length} attachments for post ${post.id}`);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Post transaction completed successfully for refId: ${post.refId}`);
      return post.refId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error in post transaction, rolling back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
