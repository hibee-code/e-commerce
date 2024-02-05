import { DeliveryStatus, PaymentStatus } from '@/lib/enums';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;

  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  // @IsEnum(PaymentStatus)
  // paymentStatus: PaymentStatus;

  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;
}
