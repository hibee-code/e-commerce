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

  @Column({ type: 'bigint' })
  productId: number;

  @Column({ type: 'numeric' })
  price: string;

  @Column({ type: 'numeric' })
  createdAt: string;

  @Column({ type: 'numeric' })
  item: number;

  @Column({ type: 'numeric' })
  updateAt: string;

  //relation

  @OneToMany(() => Cart, (cart) => cart.userId)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.user)
  @JoinColumn({ name: 'productId' })
  product: Product;
}
