import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePartsAndServiceDto } from './dto/create-parts_and_service.dto';
import { UpdatePartsAndServiceDto } from './dto/update-parts_and_service.dto';
import { PartsAndService } from './entities/parts_and_service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartsAndServicesService {

  constructor(
    @InjectRepository(PartsAndService)
    private readonly pasRepository: Repository<PartsAndService>
  ) { }


  // create(createPartsAndServiceDto: CreatePartsAndServiceDto) {
  //   return 'This action adds a new partsAndService';
  // }

  async findAll() {
    return this.pasRepository.find()
  }

  async findById(id: number): Promise<PartsAndService> {
    return this.pasRepository.findOne({
      where: {
        pas_id: id
      }
    })
  }

  async update(id: number, updatePartsAndServiceDto: UpdatePartsAndServiceDto) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Item not found`)
    }

    const item = await this.pasRepository.preload({
      pas_id: id,
      ...updatePartsAndServiceDto
    })

    return this.pasRepository.save(item)
  }

  async remove(id: number) {


    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Item not found`)
    }


    await this.pasRepository.createQueryBuilder('pas')
      .delete()
      .from(PartsAndService)
      .where('pas_id = :pas_id', { pas_id: id })
      .execute()


  }
}
