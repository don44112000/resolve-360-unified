import { Controller, Post, Body, HttpCode, HttpStatus, Res, Get } from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { createPostDTO } from '../dtos/requestDTO';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create-post')
  async createPost(@Body() body: createPostDTO, @Res() res: Response) {
    try {
      const refId = await this.postsService.createPostWithTransaction(body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Post created successfully',
        data: refId,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create post',
        error: error.message,
        success: false,
      });
    }
  }

  @Get('all-posts')
  async getAllPosts(@Res() res: Response) {
    try {
      const posts = await this.postsService.getAllPosts();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Posts fetched successfully',
        data: posts,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to fetch posts',
        error: error.message,
        success: false,
      });
    }
  }
}
