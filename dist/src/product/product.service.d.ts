import { DataSource } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { Product } from './entities/product.entity';
export declare class ProductService {
    private readonly datasource;
    private dbManager;
    constructor(datasource: DataSource);
    create(product: ProductDto): Promise<Product>;
    all_product(): Promise<Product[]>;
    getProductDetails(productId: string): Promise<Product>;
    searchProducts(searchQuery: string): Promise<Product[]>;
    filterProducts(filterParams: any, page: number, limit: number): Promise<{
        products: Product[];
        total: number;
    }>;
}
