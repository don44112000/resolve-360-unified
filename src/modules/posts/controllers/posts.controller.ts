import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Get,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { PostsService } from '../services/posts.service';
import { CreatePostDTO } from '../dtos/requestDTO';
import { Request, Response } from 'express';
import { AuthGuard } from '../../../shared/middlewares/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create-post')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  async createPost(@Body() body: CreatePostDTO, @Req() req: Request, @Res() res: Response) {
    try {
      // Access authenticated user info from JWT token
      const authenticatedUser = (req as any).user; // IJwtPayload with userRefId
      if (body.customerRefId !== authenticatedUser.userRefId) {
        throw new HttpException('Customer Ref Id does not match', HttpStatus.BAD_REQUEST);
      }

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
      const posts = await this.postsService.getAllPostsV2();
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
