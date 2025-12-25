import { IsString, IsOptional } from 'class-validator';

export class RequestDTO {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;
}
