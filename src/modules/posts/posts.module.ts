import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entities/Posts/post.entity';
import { PostsService } from './services/posts.service';
import { PostsController } from './controllers/posts.controller';
import { CustomersModule } from '../customers/customers.module';
import { BrandsModule } from '../brands/brands.module';
import { PostAttachmentsModule } from '../post-attachments/post-attachments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CustomersModule, BrandsModule, PostAttachmentsModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
