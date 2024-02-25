import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Product_DetailsDto {
  @IsNotEmpty()
  @IsString()
  specification: string;

  @IsNotEmpty()
  @IsString()
  colour: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;
}
