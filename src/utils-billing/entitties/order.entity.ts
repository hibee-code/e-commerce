import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus, PaymentStatus } from './../../lib/enums';
import { Cart } from './cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'boolean', nullable: true })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  orderDate: Date;

  @Column({ type: 'enum', enum: DeliveryStatus })
  deliveryStatus: DeliveryStatus;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @Column({ type: 'bigint', nullable: true })
  cartId: number;

  //relation

  @OneToOne(() => Cart, (cart) => cart.userId)
  cart: Cart;
}
