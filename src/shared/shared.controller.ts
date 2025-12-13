import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse } from '@nestjs/swagger';
import { S3Service } from './services/s3.service';
import { UploadFileDto, UploadFileResponseDto } from './dto/upload-file.dto';

/**
 * Shared Controller
 * Provides common endpoints for shared functionality like file uploads
 */
@ApiTags('Shared')
@Controller('shared')
export class SharedController {
  // Maximum file size: 10MB
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Allowed file types
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(private readonly s3Service: S3Service) {}

  /**
   * Upload file to S3
   * @param file - The file to upload
   * @returns S3 object URL and file metadata
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload file to S3',
    description: 'Upload images, videos, or documents to S3. Max size: 10MB',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: UploadFileDto,
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    type: UploadFileResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or size',
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|gif|mp4|mpeg|mov|pdf|doc|docx)$/i,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    // Validate MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type: ${file.mimetype}. Allowed types: ${this.ALLOWED_MIME_TYPES.join(', ')}`,
      );
    }

    // Sanitize filename to prevent path traversal
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Generate a unique key with file extension
    const timestamp = Date.now();
    const key = `uploads/${timestamp}-${sanitizedFilename}`;

    // Upload to S3 using the existing uploadFile function with mimetype
    const url = await this.s3Service.uploadFile(file.buffer, key, file.mimetype);

    return {
      url,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }
}
