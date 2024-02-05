import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Cart } from './cart.entity';

@Entity()
export class CartDetails {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', nullable: true })
  cartId: number;

  @Column({ type: 'bigint', nullable: true })
  productId: number;

  @Column({ type: 'bigint', nullable: true })
  price: string;

  @Column({ type: 'bigint', nullable: true })
  createdAt: string;

  @Column({ type: 'bigint', nullable: true })
  item: number;

  @Column({ type: 'bigint', nullable: true })
  updateAt: string;

  //relation

  @OneToMany(() => Cart, (cart) => cart.userId)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.user)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
