import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceOrder } from '../../service_order/entities/service_order.entity';

@Entity('tb_client')
export class Client {
  @PrimaryGeneratedColumn()
  client_id: number;

  @Column({ unique: true })
  client_name: string;

  @Column()
  client_phone: string;

  @Column()
  client_cpf:string

  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.client)
  serviceOrders: ServiceOrder[];

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
