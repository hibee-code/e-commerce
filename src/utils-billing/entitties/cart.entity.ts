import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  price: number;

  @Column({ type: 'bigint', nullable: true })
  quantity: number;

  @Column({ type: 'bigint', nullable: true })
  totalItem: number;

  @Column({ type: 'int', nullable: true })
  userId: number;

  // @Column({ type: 'enum', enum: PaymentStatus })
  // paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  image: URL;

  @OneToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Product, (product) => product.user)
  items: Product[];
}
