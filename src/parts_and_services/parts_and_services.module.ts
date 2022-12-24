import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsAndService } from './entities/parts_and_service.entity';
import { PartsAndServicesController } from './parts_and_services.controller';
import { PartsAndServicesService } from './parts_and_services.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([PartsAndService])
  ],
  controllers: [PartsAndServicesController],
  providers: [PartsAndServicesService]
})
export class PartsAndServicesModule {}
