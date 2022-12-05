import { Category } from "src/category/entities/category.entity";
import { Invoice } from "src/invoice/entities/invoice.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


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
    product_location: string

    @Column()
    product_quantity: number

    @Column()
    product_quantity_minimal: number

    @Column({ nullable: true })
    product_price: number

    @Column({ nullable: true })
    product_price_buy: number

    @Column()
    product_category_id: number

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "product_category_id" })
    category: Category

    @ManyToMany(() => Invoice, { cascade: true, nullable: true })
    @JoinTable({
        name: 'products_in_invoice',
        joinColumn: {
            name: 'product_id',
            referencedColumnName: 'product_id',
        },
        inverseJoinColumn: {
            name: 'invoice_id',
            referencedColumnName: 'invoice_id',
        },
    })
    invoce: Invoice[];

    @Column()
    is_active: boolean

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date


}
