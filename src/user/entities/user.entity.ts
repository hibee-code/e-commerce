import { Column, ManyToMany } from 'typeorm';
import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../utils-billing/entitties/product.entity';
//import { Order } from './order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  firstName: string;

  // @Column({ type: 'varchar', nullable: true })
  // middleName: string;

  @Column({ type: 'varchar', nullable: true })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  // @Column({ type: 'varchar', nullable: true })
  // phone: string;

  //relation

  @ManyToMany(() => Product, (product) => product.user)
  products: Product[];
  cart: any;
}
