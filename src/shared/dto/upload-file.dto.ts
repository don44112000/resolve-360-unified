import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload (images, videos, or documents)',
  })
  file: Express.Multer.File;
}

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'S3 URL of the uploaded file',
    example: 'https://s3.amazonaws.com/bucket/uploads/1234567890-example.jpg',
  })
  url: string;

  @ApiProperty({
    description: 'Original filename',
    example: 'example.jpg',
  })
  filename: string;

  @ApiProperty({
    description: 'File mimetype',
    example: 'image/jpeg',
  })
  mimetype: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 102400,
  })
  size: number;
}
