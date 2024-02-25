import { Column, ManyToMany } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  firstName: string;

  // @Column({ type: 'varchar', nullable: true })
  // middleName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  //relation

  @ManyToMany(() => Product, (product) => product.cartProducts)
  products: Product[];

  // @ManyToOne(() => User, (user) => user.carts)
  // user: User;

  // @OneToMany(() => Order, (order) => order.user)
  // orders: Order[];
}
