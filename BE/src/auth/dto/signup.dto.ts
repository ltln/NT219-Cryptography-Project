import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  @ApiProperty()
  username: string;

  @IsString()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  fullName: string;
}
