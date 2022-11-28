import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tb_sale')
export class Sale {
  @PrimaryGeneratedColumn()
  sale_id: number;

  @Column()
  sale_number: number;

  @Column()
  sale_value: number;

  @CreateDateColumn()
  sale_date: Date;

  @ManyToOne(() => User, (user) => user.sales)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: 'products_in_sale',
    joinColumn: {
      name: 'sale_id',
      referencedColumnName: 'sale_id',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'product_id',
    },
  })
  products: Product[];
}
