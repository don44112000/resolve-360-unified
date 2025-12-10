import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { AccessLevel } from '../../../shared/enums/common.enum';

export class RequestDTO {
  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsNotEmpty()
  @IsEnum(AccessLevel)
  accessLevel: AccessLevel;
}
