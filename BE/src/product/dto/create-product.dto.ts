import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  coverImage: string;

  @IsString()
  coverType: 'HARD' | 'SOFT';

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dimensionsX: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dimensionsY: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dimensionsZ: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weight: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discount: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  language?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pageCount: number;

  @IsString()
  publisher: string;

  @IsString()
  author: string;

  @Type(() => Number)
  @IsNumber()
  publishYear: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  category?: string;
}
