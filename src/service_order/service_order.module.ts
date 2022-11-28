import { Module } from '@nestjs/common';
import { ServiceOrderService } from './service_order.service';
import { ServiceOrderController } from './service_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceOrder } from './entities/service_order.entity';
import { Device } from 'src/device/entities/device.entity';
import { PartsAndService } from '../parts_and_services/entities/parts_and_service.entity';
import { ClientModule } from 'src/client/client.module';
import { TechnicianModule } from '../technician/technician.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ServiceOrder, Device, PartsAndService]),
    ClientModule,
    TechnicianModule,
    UserModule
  ],
  controllers: [ServiceOrderController],
  providers: [ServiceOrderService],
})
export class ServiceOrderModule {}
