import { IsString, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Pagination DTO
 * Used for paginated API endpoints
 */
export class PaginationDto {
    @ApiProperty({ description: 'Page number', example: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ description: 'Items per page', example: 10, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}

/**
 * ID parameter DTO
 * Used for path parameters
 */
export class IdParamDto {
    @ApiProperty({ description: 'Resource ID', example: '123' })
    @IsString()
    id: string;
}

/**
 * Search query DTO
 * Used for search endpoints
 */
export class SearchDto extends PaginationDto {
    @ApiProperty({ description: 'Search query', example: 'search term', required: false })
    @IsOptional()
    @IsString()
    query?: string;
}
