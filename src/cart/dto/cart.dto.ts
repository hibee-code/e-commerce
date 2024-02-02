import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  totalItem: number;

  @IsNotEmpty()
  @IsString()
  image: string;
}
