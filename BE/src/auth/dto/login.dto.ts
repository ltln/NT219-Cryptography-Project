import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum MFAType {
  TOTP = 'totp',
  EMAIL = 'email',
}

export class LoginDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsOptional()
  @IsEnum(MFAType, { message: 'mfa_type must be email or totp' })
  mfa_type: MFAType;

  @IsOptional()
  @IsString()
  code: string;
}
