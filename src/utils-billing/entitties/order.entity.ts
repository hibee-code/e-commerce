import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DeliveryStatus } from './../../lib/enums';
import { Cart } from './cart.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cartId: number;

  @Column({ type: 'varchar', nullable: true })
  isPaid: string;

  @Column({ type: 'date', nullable: true })
  orderDate: Date;

  //foreign_keys;

  @Column({ type: 'enum', enum: DeliveryStatus })
  deliveryStatus: DeliveryStatus;

  //relation

  @OneToOne(() => Cart, (cart) => cart.userId)
  cart: Cart;
}
