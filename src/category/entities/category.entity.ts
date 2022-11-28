import { Product } from './../../product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tb_category')
export class Category {

    @PrimaryGeneratedColumn()
    category_id : number

    @Column()
    category_name: string

    @Column()
    is_active: boolean

    @OneToMany(()=> Product,(product)=> product.category)
    products:Product[]


}
