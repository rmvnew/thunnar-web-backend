import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { Technician } from './entities/technician.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TechnicianService {
  constructor(
    @InjectRepository(Technician)
    private readonly technicianRepository: Repository<Technician>,
  ) {}

  async create(createTechnicianDto: CreateTechnicianDto) {
    const { technician_name } = createTechnicianDto;
    const createTechnician =
      this.technicianRepository.create(createTechnicianDto);

    createTechnician.technician_name = technician_name.toUpperCase();
    createTechnician.is_active = true;

    return this.technicianRepository.save(createTechnician);
  }

  async findAll() {
    return this.technicianRepository.find();
  }

  async findById(id: number) {
    return this.technicianRepository.findOne({
      where: {
        technician_id: id,
      },
    });
  }

  async update(id: number, updateTechnicianDto: UpdateTechnicianDto) {
    const isRegistered = await this.findById(id);

    if (!isRegistered) {
      throw new NotFoundException(`technician not found`);
    }

    const updateTechnician = await this.technicianRepository.preload({
      technician_id: id,
      ...updateTechnicianDto,
    });

    const { technician_name } = updateTechnicianDto;

    updateTechnician.technician_name = technician_name.toUpperCase();

    return this.technicianRepository.save(updateTechnician);
  }

  async changeStatus(id: number) {
    const isRegistered = await this.findById(id);

    if (!isRegistered) {
      throw new NotFoundException(`technician not found`);
    }

    const { is_active } = isRegistered;

    isRegistered.is_active = !is_active;

    return this.technicianRepository.save(isRegistered);
  }
}
