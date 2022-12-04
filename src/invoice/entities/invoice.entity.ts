import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tb_invoice')
export class Invoice {


    @PrimaryGeneratedColumn()
    invoice_id: number

    @Column()
    invoice_number: string

    @Column()
    invoice_value: number

    @CreateDateColumn()
    invoice_date: Date



}
