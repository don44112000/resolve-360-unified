import { IsString, IsEmail, IsOptional, MaxLength, IsNotEmpty, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneEmailDTO {
  // Email is required if phone/countryCode are not provided
  @ApiProperty({ required: false })
  @ValidateIf((o) => !o.phone || !o.countryCode)
  @IsNotEmpty({ message: 'email is required when phone and countryCode are not provided' })
  @IsEmail()
  @MaxLength(255)
  email?: string;

  // CountryCode is required if phone is provided OR if email is not provided
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.phone && !o.email)
  @IsNotEmpty({
    message: 'countryCode is required when phone is provided or when email is not provided',
  })
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  // Phone is required if countryCode is provided OR if email is not provided
  @ApiProperty({ required: false })
  @ValidateIf((o) => o.countryCode && !o.email)
  @IsNotEmpty({
    message: 'phone is required when countryCode is provided or when email is not provided',
  })
  @IsString()
  @MaxLength(20)
  phone?: string;
}
export class CreateCustomerDTO extends PhoneEmailDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
export class CustomerPasswordLoginDTO extends PhoneEmailDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;
}
