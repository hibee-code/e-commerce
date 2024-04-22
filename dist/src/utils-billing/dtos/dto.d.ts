import { DeliveryStatus, PaymentStatus, ProductCategory } from './../../lib/enums';
export declare class Product {
    name: string;
    tag: number;
    price: number;
    decription: string;
    quantity: number;
    rate: number;
    category: ProductCategory;
}
export declare class Order {
    totalAmount: number;
    isPaid: boolean;
    userId: bigint;
    orderDate: Date;
    cartId: bigint;
    status: DeliveryStatus;
}
export declare class Cart {
    decription: string;
    quantity: number;
    price: number;
    productId: bigint;
    image: string;
}
export declare class User {
    userId: bigint;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
export declare class Cart_details {
    totalAmount: number;
    totalItem: number;
    status: PaymentStatus;
    cartId: bigint;
}
export declare class Payment {
    orderId: bigint;
    status: PaymentStatus;
}
