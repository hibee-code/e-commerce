import { ProductCategory } from '../../lib/enums';
import { CartProduct } from '../../cart-product/entities/cartProduct.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: string;
    tag: string;
    stockQuantity: number;
    productCategory: ProductCategory;
    cartProducts: CartProduct[];
}
