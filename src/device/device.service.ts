import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
  ) {}

  async create(createDeviceDto: CreateDeviceDto) {
    const { device_brand, device_model, device_serial_number } =
      createDeviceDto;

    const createDevice = this.deviceRepository.create(createDeviceDto);

    createDevice.device_brand = device_brand.toUpperCase();
    createDevice.device_model = device_model.toUpperCase();
    createDevice.device_serial_number = device_serial_number.toUpperCase();

    return this.deviceRepository.save(createDevice);
  }

  async findAll() {
    return this.deviceRepository.find();
  }

  async findById(id: number) {
    return this.deviceRepository.findOne({
      where: {
        device_id: id,
      },
    });
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {



    return `This action updates a #${id} device`;
  }

  remove(id: number) {
    return `This action removes a #${id} device`;
  }
}
