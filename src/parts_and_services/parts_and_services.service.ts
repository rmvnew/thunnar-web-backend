import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePartsAndServiceDto } from './dto/create-parts_and_service.dto';
import { UpdatePartsAndServiceDto } from './dto/update-parts_and_service.dto';
import { PartsAndService } from './entities/parts_and_service.entity';

@Injectable()
export class PartsAndServicesService {

 
  create(createPartsAndServiceDto: CreatePartsAndServiceDto) {
    return 'This action adds a new partsAndService';
  }

  findAll() {
    return `This action returns all partsAndServices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} partsAndService`;
  }

  update(id: number, updatePartsAndServiceDto: UpdatePartsAndServiceDto) {
    return `This action updates a #${id} partsAndService`;
  }

  remove(id: number) {
    return `This action removes a #${id} partsAndService`;
  }
}
