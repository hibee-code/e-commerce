import { Product } from '../../product/entities/product.entity';
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    products: Product[];
}
