import { ProductCategory } from '@/lib/enums';
export declare class ProductDto {
    name: string;
    description: string;
    brand: string;
    price: string;
    tag: string;
    stockQuantity: number;
    productCategory: ProductCategory;
    priceMin: any;
}
