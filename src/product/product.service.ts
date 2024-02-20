import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  private dbManager: EntityManager;
  constructor(private readonly datasource: DataSource) {
    this.dbManager = datasource.manager;
  }

  async create(product: ProductDto): Promise<Product> {
    const newProduct = this.dbManager.create(Product, product);
    const saveProduct = await this.dbManager.save(newProduct);
    return saveProduct;
  }

  async all_product(): Promise<Product[]> {
    const product = await this.dbManager.find(Product);
    return product;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.dbManager.findOne(Product, {
      where: { id: productId },
    });
    return product;
  }
  async searchProducts(searchQuery: string): Promise<Product[]> {
    const products = await this.dbManager
      .createQueryBuilder(Product, 'product')
      .where('LOWER(product.name) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${searchQuery}%`,
      })
      .orWhere('LOWER(product.brand) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${searchQuery}%`,
      })
      .orWhere('LOWER(product.category) LIKE LOWER(:searchQuery)', {
        searchQuery: `%${searchQuery}%`,
      })
      .getMany();
    console.log(products, 'my result');
    return products;
  }
}
