import { DeliveryStatus, PaymentStatus } from '@/lib/enums';
export declare class OrderDto {
    cartId: string;
    isPaid: boolean;
    orderDate: Date;
    paymentStatus: PaymentStatus;
    deliveryStatus: DeliveryStatus;
}
