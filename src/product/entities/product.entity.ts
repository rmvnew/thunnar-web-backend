import { Category } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("tb_product")
export class Product {

    @PrimaryGeneratedColumn()
    product_id: number

    @Column({ unique: true, nullable: false })
    product_name: string

    @Column()
    product_barcode: string

    @Column()
    product_code: string

    @Column()
    product_location:string

    @Column()
    product_quantity: number

    @Column()
    product_quantity_minimal: number

    @Column({ nullable: true })
    invoice_number: number

    @Column({ nullable: true })
    product_price: number

    @Column({ nullable: true })
    product_price_buy: number

    @Column()
    product_categoty_id:number

    @ManyToOne(()=> Category,(category)=> category.products)
    @JoinColumn({name:"product_categoty_id"})
    category:Category

    @Column()
    is_active: boolean

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date


}
