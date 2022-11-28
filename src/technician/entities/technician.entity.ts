import { ServiceOrder } from 'src/service_order/entities/service_order.entity';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('tb_technician')
export class Technician {
  @PrimaryGeneratedColumn()
  technician_id: number;

  @Column()
  technician_name: string;

  @Column()
  technician_phone: string;

  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.technician)
  serviceOrders: ServiceOrder[];

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
