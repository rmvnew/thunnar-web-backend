import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DeviceStatus } from '../../common/Enums';
import { PartsAndService } from '../../parts_and_services/entities/parts_and_service.entity';
import { CreatePartsAndServiceDto } from '../../parts_and_services/dto/create-parts_and_service.dto';

@Entity('tb_device')
export class Device {
  @PrimaryGeneratedColumn()
  device_id: number;

  @Column()
  device_brand: string;

  @Column()
  device_model: string;

  @Column({ nullable: true })
  device_serial_number: string;

  @Column({ nullable: true })
  device_imei: string;

  @Column()
  device_problem_reported: string;

  @Column({ nullable: true })
  device_problem_detected: string;

  @Column({ nullable: true })
  device_status: DeviceStatus;

  @ManyToMany(() => PartsAndService, { cascade: true })
  @JoinTable({
    name: 'parts_and_service_in_devices',
    joinColumn: {
      name: 'device_id',
      referencedColumnName: 'device_id',
    },
    inverseJoinColumn: {
      name: 'pas_id',
      referencedColumnName: 'pas_id',
    },
  })
  parts_and_services: CreatePartsAndServiceDto[];
}
