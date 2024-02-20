import { DeliveryStatus, PaymentStatus } from '@/lib/enums';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class OrderDto {
  @IsNotEmpty()
  @IsString()
  cartId: string;

  @IsNotEmpty()
  @IsBoolean()
  isPaid: boolean;

  @IsNotEmpty()
  @IsDateString()
  orderDate: Date;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsEnum(DeliveryStatus)
  deliveryStatus: DeliveryStatus;
}
