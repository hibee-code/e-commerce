import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductCategory } from '../../lib/enums';
import { CartProduct } from '../../cart-product/entities/cartProduct.entity';
import { Product_Details } from '../../product-details/entities/product_details.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  brand: string;

  @Column({ type: 'numeric' })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  tag: string;

  @Column({ type: 'integer', nullable: true })
  stockQuantity: number;

  @Column({ type: 'enum', enum: ProductCategory })
  productCategory: ProductCategory;

  @OneToOne(() => Product_Details, (product_details) => product_details.product)
  product_details: Product_Details;
  @OneToMany(() => CartProduct, (cartProduct) => cartProduct.product)
  cartProducts: CartProduct[];
}
