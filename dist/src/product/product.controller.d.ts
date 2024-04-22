import { ProductDto } from './dto/product.dto';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    create(productDto: ProductDto): Promise<Product>;
    getAll_product(): Promise<Product[]>;
    getProduct(productId: string): Promise<Product>;
    searchProducts(searchQuery: string): Promise<Product[]>;
    filterProducts(filterParams: any, page: number, limit: number): Promise<{
        products: Product[];
        total: number;
    }>;
}
