import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create-product')
  async create(@Body() productDto: ProductDto): Promise<Product> {
    const product = await this.productService.create(productDto);
    return product;
  }

  @Get('view-all-product')
  async getAll_product(): Promise<Product[]> {
    const products = await this.productService.all_product();
    return products;
  }
  @Get(':id')
  async getProduct(@Param('id') productId: string): Promise<Product> {
    const product = await this.productService.getProduct(productId);
    return product;
  }
  @Get('search')
  async search(@Query('/:search') searchQuery: string): Promise<Product[]> {
    return await this.productService.searchProducts(searchQuery);
  }
}
