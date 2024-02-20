import { PaymentStatus, ProductCategory } from '@/lib/enums';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @IsEnum(ProductCategory)
  productCategory: ProductCategory;
}
