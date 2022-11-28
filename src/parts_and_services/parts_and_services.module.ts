import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartsAndService } from './entities/parts_and_service.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([PartsAndService])
  ],
  controllers: [],
  providers: []
})
export class PartsAndServicesModule {}
