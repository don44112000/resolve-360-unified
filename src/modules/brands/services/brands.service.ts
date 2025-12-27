import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, DataSource } from 'typeorm';
import { Brand } from '../../../entities/Brands/brand.entity';
import { CreateBrandDTO, CreateBrandByUserDTO, SearchBrandDTO } from '../dtos/requestDTO';
import { BrandStatus } from '../../../shared/enums/common.enum';
const DEFAULT_LOGO_URL = 'https://hilarious-nougat-bcb604.netlify.app/image.jpg';

@Injectable()
export class BrandsService {
  private readonly logger = new Logger(BrandsService.name);

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly dataSource: DataSource,
  ) {
    this.logger.log('BrandsService initialized');
  }

  //USED BY INTERNAL TEAM TO REGISTER THE BRAND
  async createBrand(body: CreateBrandDTO, transactionManager?: EntityManager): Promise<Brand> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = manager.create(Brand, {
        legalName: body.legalName,
        displayName: body.displayName,
        shortName: body.shortName,
        primaryDomain: body.primaryDomain,
        primaryEmail: body.primaryEmail,
        primaryCountryCode: body.primaryCountryCode,
        primaryPhone: body.primaryPhone,
        logoUrl: DEFAULT_LOGO_URL, // body.logoUrl,
        contactMeta: body.contactMeta,
        isVerified: true,
        status: BrandStatus.ACTIVE,
      });
      const savedBrand = await manager.save(Brand, brand);
      this.logger.log(`Brand created successfully with ID: ${savedBrand.id}`);
      return savedBrand;
    } catch (error) {
      this.logger.error('Error creating brand:', error);
      throw error;
    }
  }

  //USED BY CUSTOMER TO QUICK REGISTER THE BRAND
  async quickCreateBrand(
    body: CreateBrandByUserDTO,
    transactionManager?: EntityManager,
  ): Promise<Brand> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = manager.create(Brand, {
        displayName: body.displayName,
        primaryDomain: body.primaryDomain,
        isVerified: false,
        status: BrandStatus.ACTIVE,
      });
      const savedBrand = await manager.save(Brand, brand);
      this.logger.log(`Brand created successfully with ID: ${savedBrand.id}`);
      return savedBrand;
    } catch (error) {
      this.logger.error('Error creating brand:', error);
      throw error;
    }
  }

  async findBrandById(id: string, transactionManager?: EntityManager): Promise<Brand> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = await manager.findOne(Brand, { where: { id } });
      return brand;
    } catch (error) {
      this.logger.error('Error finding brand by ID:', error);
      throw error;
    }
  }

  async findBrandByRefId(refId: string, transactionManager?: EntityManager): Promise<Brand> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = await manager.findOne(Brand, { where: { refId } });
      return brand;
    } catch (error) {
      this.logger.error('Error finding brand by refId:', error);
      throw error;
    }
  }

  async findAllBrands(transactionManager?: EntityManager): Promise<Brand[]> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brands = await manager.find(Brand);
      return brands;
    } catch (error) {
      this.logger.error('Error finding all brands:', error);
      throw error;
    }
  }

  async updateBrand(
    refId: string,
    body: CreateBrandDTO,
    transactionManager?: EntityManager,
  ): Promise<Brand> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = await this.findBrandByRefId(refId, manager);

      // Update only provided fields
      if (body.legalName !== undefined) brand.legalName = body.legalName;
      if (body.displayName !== undefined) brand.displayName = body.displayName;
      if (body.shortName !== undefined) brand.shortName = body.shortName;
      if (body.primaryDomain !== undefined) brand.primaryDomain = body.primaryDomain;
      if (body.primaryEmail !== undefined) brand.primaryEmail = body.primaryEmail;
      if (body.primaryCountryCode !== undefined) brand.primaryCountryCode = body.primaryCountryCode;
      if (body.primaryPhone !== undefined) brand.primaryPhone = body.primaryPhone;
      if (body.logoUrl !== undefined) brand.logoUrl = body.logoUrl;
      if (body.contactMeta !== undefined) brand.contactMeta = body.contactMeta;
      const updatedBrand = await manager.save(Brand, brand);
      this.logger.log(`Brand updated successfully with refId: ${refId}`);
      return updatedBrand;
    } catch (error) {
      this.logger.error('Error updating brand:', error);
      throw error;
    }
  }

  async deleteBrand(refId: string, transactionManager?: EntityManager): Promise<void> {
    try {
      const manager = transactionManager || this.dataSource.manager;
      const brand = await this.findBrandByRefId(refId, manager);
      await manager.remove(Brand, brand);
      this.logger.log(`Brand deleted successfully with refId: ${refId}`);
    } catch (error) {
      this.logger.error('Error deleting brand:', error);
      throw error;
    }
  }

  async createBrandWithTransaction(body: CreateBrandDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.createBrand(body, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result.refId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async searchBrandsBySearchKey(body: SearchBrandDTO): Promise<any> {
    try {
      // Set defaults
      const { searchKey, limit = 25, page = 1 } = body;

      const queryBuilder = this.brandRepository
        .createQueryBuilder('brand')
        .select(['brand.refId', 'brand.displayName', 'brand.logoUrl']); // Only fetch needed fields

      // Search in legalName, displayName, and shortName
      if (searchKey && searchKey.trim()) {
        queryBuilder.where(
          `(
            brand.legal_name ILIKE :searchKey OR
            brand.display_name ILIKE :searchKey OR
            brand.short_name ILIKE :searchKey
          )`,
          { searchKey: `%${searchKey.trim()}%` },
        );
      }

      // Single query with pagination - no count query
      const brands = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      // Check if empty after fetching
      if (brands.length === 0) {
        return {
          message: 'No brands found matching the search criteria',
          data: { items: [] },
          success: true,
        };
      }

      const transformedData = brands.map((brand) => ({
        refId: brand.refId,
        displayName: brand.displayName,
        logoUrl: brand.logoUrl,
      }));

      return {
        message: `Found ${transformedData.length} brand(s) matching the search criteria`,
        data: { items: transformedData },
        success: true,
      };
    } catch (error) {
      this.logger.error('Error searching brands:', error);
      throw error;
    }
  }

  async quickCreateBrandWithTransaction(body: CreateBrandByUserDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.quickCreateBrand(body, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result.refId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateBrandWithTransaction(refId: string, body: CreateBrandDTO): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.updateBrand(refId, body, queryRunner.manager);
      await queryRunner.commitTransaction();
      return result.refId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
