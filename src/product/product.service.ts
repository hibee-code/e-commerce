import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, ILike } from 'typeorm';
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
    const products = await this.dbManager.find(Product, {
      where: [
        { name: ILike(`%${searchQuery}%`) },
        { brand: ILike(`%${searchQuery}%`) },
        { tag: ILike(`%${searchQuery}%`) },
        { productCategory: searchQuery as any },
      ],
    });

    return products;
  }
}
