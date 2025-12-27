import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Post } from '../../../entities/Posts/post.entity';
import { CreatePostDTO, SavePostDTO } from '../dtos/requestDTO';
import { CustomersService } from '../../customers/services/customers.service';
import { BrandsService } from '../../brands/services/brands.service';
import { PostAttachmentsService } from '../../post-attachments/services/post-attachments.service';
import { PostStatus, PostPriority } from '../../../shared/enums/common.enum';
import { PostsQueryRepository } from '../repositories/posts.queries';

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
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {
    this.logger.log('PostsService initialized');
  }

  async createPost(body: SavePostDTO, transactionManager?: EntityManager): Promise<Post> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      const post = manager.create(Post, {
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

      const savedPost = await manager.save(post);
      this.logger.log(`Post created successfully with ID: ${savedPost.id}`);
      return savedPost;
    } catch (error) {
      this.logger.error('Error creating post:', error);
      throw error;
    }
  }

  async getAllPosts(transactionManager?: EntityManager): Promise<any[]> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      // Fetch all posts with their attachments, customer, and brand details using query builder
      const posts = await manager
        .getRepository(Post)
        .createQueryBuilder('post')
        .leftJoinAndSelect(
          'post_attachments',
          'attachment',
          'attachment.post_id = post.id AND attachment.is_deleted = false',
        )
        .leftJoin('customers', 'customer', 'customer.id = post.customer_id')
        .leftJoin('brands', 'brand', 'brand.id = post.brand_id')
        .addSelect(['customer.name', 'brand.display_name', 'brand.logo_url'])
        .orderBy('post.created_at', 'DESC')
        .getRawAndEntities();

      // Map the results to include attachments and details
      const postsWithDetails = posts.entities.map((post) => {
        // Find the corresponding raw data for this post
        const postRaw = posts.raw.find((raw) => raw.post_id === post.id);

        // Get all attachments for this post
        const attachments = posts.raw
          .filter((raw) => raw.post_id === post.id && raw.attachment_id)
          .map((raw) => ({
            id: raw.attachment_id,
            refId: raw.attachment_ref_id,
            fileUrl: raw.attachment_file_url,
            fileName: raw.attachment_file_name,
            fileType: raw.attachment_file_type,
            isPublic: raw.attachment_is_public,
            createdAt: raw.attachment_created_at,
          }));

        return {
          id: post.id,
          refId: post.refId,
          title: post.title,
          description: post.description,
          status: post.status,
          priority: post.priority,
          isPublic: post.isPublic,
          isVerified: post.isVerified,
          isEdited: post.isEdited,
          meta: post.meta,
          createdAt: post.createdAt,
          customerDetails: {
            name: postRaw?.customer_name || null,
          },
          brandDetails: {
            name: postRaw?.display_name || null,
            logoUrl: postRaw?.logo_url || null,
          },
          attachments,
        };
      });

      this.logger.log(`Fetched ${postsWithDetails.length} posts`);
      return postsWithDetails;
    } catch (error) {
      this.logger.error('Error fetching posts:', error);
      throw error;
    }
  }

  async getAllPostsV2(transactionManager?: EntityManager): Promise<any[]> {
    try {
      const manager = transactionManager || this.dataSource.manager;

      // Get the raw SQL query
      const rawQuery = this.postsQueryRepository.getAllPostsRawQuery();

      // Execute the raw query
      const results = await manager.query(rawQuery);

      // Extract the post objects from the results
      const postsWithDetails = results.map((row: any) => row.post);

      this.logger.log(`Fetched ${postsWithDetails.length} posts using raw SQL`);
      return postsWithDetails;
    } catch (error) {
      this.logger.error('Error fetching posts with raw SQL:', error);
      throw error;
    }
  }

  async createPostWithTransaction(body: CreatePostDTO): Promise<any> {
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
