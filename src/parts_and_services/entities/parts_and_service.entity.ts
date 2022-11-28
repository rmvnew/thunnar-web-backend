import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tb_parts_and_services')
export class PartsAndService {
  @PrimaryGeneratedColumn()
  pas_id: number;

  @Column()
  pas_description: string;

  @Column()
  pas_quantity: number;

  @Column()
  pas_price: number;

  @Column()
  is_active: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  update_at: Date;
}
