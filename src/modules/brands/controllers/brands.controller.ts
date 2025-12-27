import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { BrandsService } from '../services/brands.service';
import { CreateBrandByUserDTO, CreateBrandDTO, SearchBrandDTO } from '../dtos/requestDTO';
import { AuthGuard } from '../../../shared/middlewares/auth.guard';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post('create-brand')
  async createBrand(@Body() body: CreateBrandDTO, @Res() res) {
    try {
      const result = await this.brandsService.createBrandWithTransaction(body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Brand created successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create brand',
        error: error.message,
        success: false,
      });
    }
  }

  @Get('all')
  async getAllBrands(@Res() res) {
    try {
      const brands = await this.brandsService.findAllBrands();
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Brands retrieved successfully',
        data: brands,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve brands',
        error: error.message,
        success: false,
      });
    }
  }

  @Get('brandRefId/:brandRefId')
  async getBrandByRefId(@Param('brandRefId') brandRefId: string, @Res() res) {
    try {
      const brand = await this.brandsService.findBrandByRefId(brandRefId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Brand retrieved successfully',
        data: brand,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to retrieve brand',
        error: error.message,
        success: false,
      });
    }
  }

  @Put('brandRefId/:brandRefId')
  async updateBrand(
    @Param('brandRefId') brandRefId: string,
    @Body() body: CreateBrandDTO,
    @Res() res,
  ) {
    try {
      const result = await this.brandsService.updateBrandWithTransaction(brandRefId, body);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Brand updated successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to update brand',
        error: error.message,
        success: false,
      });
    }
  }

  @Delete('brandRefId/:brandRefId')
  async deleteBrand(@Param('brandRefId') brandRefId: string, @Res() res) {
    try {
      await this.brandsService.deleteBrand(brandRefId);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Brand deleted successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to delete brand',
        error: error.message,
        success: false,
      });
    }
  }

  @Post('quick-create-brand')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT')
  async createBrandByUser(@Body() body: CreateBrandByUserDTO, @Req() req: Request, @Res() res) {
    try {
      // Access authenticated user info from JWT token
      const authenticatedUser = (req as any).user; // IJwtPayload with userRefId

      const result = await this.brandsService.quickCreateBrandWithTransaction(body);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Brand created successfully',
        data: result,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create brand',
        error: error.message,
        success: false,
      });
    }
  }

  @Post('key-search')
  async searchBrands(@Body() body: SearchBrandDTO, @Res() res) {
    try {
      const result = await this.brandsService.searchBrandsBySearchKey(body);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to search brands',
        error: error.message,
        success: false,
      });
    }
  }
}
