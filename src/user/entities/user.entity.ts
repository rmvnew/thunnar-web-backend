import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Sale } from 'src/sale/entities/sale.entity';
import { ServiceOrder } from 'src/service_order/entities/service_order.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tb_user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  user_name: string;

  @Column()
  user_email: string;

  @Column()
  user_password: string;

  @Column({ nullable: true })
  user_refresh_token: string;

  @Column()
  user_profile_id: number;

  @Column()
  user_first_access: boolean;

  @ManyToOne(() => ProfileEntity, (profile) => profile.users)
  @JoinColumn({ name: 'user_profile_id' })
  profile: ProfileEntity;

  @OneToMany(() => ServiceOrder, (serviceOrder) => serviceOrder.user)
  serviceOrders: ServiceOrder[];

  @OneToMany(() => Sale, (sale) => sale.user)
  sales: Sale[];

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
