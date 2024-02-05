import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsNumber()
  totalItem: number;

  @IsOptional()
  @IsString()
  image: string;
}
