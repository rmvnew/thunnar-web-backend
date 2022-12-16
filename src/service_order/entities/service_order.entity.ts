import { OrderStatus } from './../../common/Enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Device } from 'src/device/entities/device.entity';
import { CreateDeviceDto } from '../../device/dto/create-device.dto';
import { Client } from 'src/client/entities/client.entity';
import { Technician } from '../../technician/entities/technician.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('tb_service_order')
export class ServiceOrder {
  @PrimaryGeneratedColumn()
  service_order_id: number;

  @Column({ nullable: false })
  service_order_number: number;

  @Column()
  service_order_date: Date;

  @Column()
  service_order_status: OrderStatus;

  @Column()
  service_order_expiration: Date;

  @ManyToMany(() => Device, { cascade: true })
  @JoinTable({
    name: 'devices_in_Service_order',
    joinColumn: {
      name: 'service_order_id',
      referencedColumnName: 'service_order_id',
    },
    inverseJoinColumn: {
      name: 'device_id',
      referencedColumnName: 'device_id',
    },
  })
  devices: CreateDeviceDto[];

  @ManyToOne(() => Client, (client) => client.serviceOrders)
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @ManyToOne(() => User, (user) => user.serviceOrders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Technician, (technician) => technician.serviceOrders)
  @JoinColumn({ name: 'technician_id' })
  technician: Technician;

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
