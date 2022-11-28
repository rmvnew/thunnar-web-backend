import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';
import { ServiceOrder } from './entities/service_order.entity';
import { DeviceStatus, OrderStatus } from '../common/Enums';
import { Utils } from '../common/Utils';
import { Device } from 'src/device/entities/device.entity';
import { PartsAndService } from '../parts_and_services/entities/parts_and_service.entity';
import { CreatePartsAndServiceDto } from '../parts_and_services/dto/create-parts_and_service.dto';
import { ClientService } from '../client/client.service';
import { TechnicianService } from '../technician/technician.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ServiceOrderService {
  constructor(
    @InjectRepository(ServiceOrder)
    private readonly serviceOrderRepository: Repository<ServiceOrder>,
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(PartsAndService)
    private readonly partsAndServiceRepository: Repository<PartsAndService>,
    private readonly clientService: ClientService,
    private readonly technicianService: TechnicianService,
    private readonly userService: UserService,
  ) {}

  async create(createServiceOrderDto: CreateServiceOrderDto) {
    const { devices, client_id, technician_id, user_id } =
      createServiceOrderDto;

    const currentClient = await this.clientService.finfById(client_id);
    const currentUser = await this.userService.findById(user_id);

    if (!currentUser) {
      throw new NotFoundException(`User not found`);
    }

    let currentTechnician = null;

    if (technician_id) {
      currentTechnician = await this.technicianService.findById(technician_id);

      if (!currentTechnician) {
        throw new NotFoundException(`Technician not found`);
      }
    }

    if (!currentClient) {
      throw new NotFoundException(`Client not foundI`);
    }

    const createOrder = this.serviceOrderRepository.create();

    createOrder.is_active = true;
    createOrder.service_order_status = OrderStatus.CREATED;
    createOrder.service_order_date = new Date();
    createOrder.service_order_expiration =
      await Utils.getInstance().getExpirationDate();

    let currentDevices = [];

    for (let device of devices) {
      const currentDevice = new Device();
      currentDevice.device_brand = device.device_brand;
      currentDevice.device_model = device.device_model;
      currentDevice.device_serial_number = device.device_serial_number;
      currentDevice.device_imei = device.device_imei;
      currentDevice.device_problem_reported = device.device_problem_reported;
      currentDevice.device_status = DeviceStatus.RECEIVED;

      if (device.parts_and_services.length > 0) {
        let currentPartsAndServices = [];

        for (let pos of device.parts_and_services) {
          const currentPos = new PartsAndService();
          currentPos.is_active = true;
          currentPos.pas_description = pos.pas_description;
          currentPos.pas_quantity = pos.pas_quantity;
          currentPos.pas_price = pos.pas_price;

          const currentPosSaved = await this.partsAndServiceRepository.save(
            currentPos,
          );

          currentPartsAndServices.push(currentPosSaved);
        }

        currentDevice.parts_and_services = currentPartsAndServices;
      }

      const currentDeviceSaved = await this.deviceRepository.save(
        currentDevice,
      );

      currentDevices.push(currentDeviceSaved);
    }

    createOrder.client = currentClient;
    createOrder.devices = currentDevices;
    createOrder.technician = currentTechnician;
    createOrder.user = currentUser;

    const res = await this.getLastOrderNumber();

    const [{ max }] = res;

    createOrder.service_orde_number = max === null ? 1 : max + 1;

    return this.serviceOrderRepository.save(createOrder);
  }

  async addNewPartsAndServicesInDevice(
    device_id: number,
    pos: CreatePartsAndServiceDto,
  ) {
    const currentDevice = await this.findDeviceById(device_id);

    const currentPos = new PartsAndService();
    currentPos.is_active = true;
    currentPos.pas_description = pos.pas_description;
    currentPos.pas_quantity = pos.pas_quantity;
    currentPos.pas_price = pos.pas_price;

    const currentPosSaved = await this.partsAndServiceRepository.save(
      currentPos,
    );

    currentDevice.parts_and_services.push(currentPosSaved);

    this.deviceRepository.save(currentDevice);
  }

  async findDeviceById(device_id: number) {
    return this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.parts_and_services', 'parts_and_services')
      .getOne();
  }

  async getLastOrderNumber() {
    return this.serviceOrderRepository.query(
      `select MAX(service_orde_number) as max from tb_service_order`,
    );
  }

  async findAll() {
    return (
      this.serviceOrderRepository
        .createQueryBuilder('so')
        .leftJoinAndSelect('so.client', 'client')
        // .leftJoinAndSelect('so.devices', 'devices')
        // .leftJoinAndSelect('devices.parts_and_services', 'parts_and_services')
        .getMany()
    );
  }

  async getAllDataById(id: number) {
    return this.serviceOrderRepository
      .createQueryBuilder('so')
      .leftJoinAndSelect('so.client', 'client')
      .leftJoinAndSelect('so.devices', 'devices')
      .leftJoinAndSelect('devices.parts_and_services', 'parts_and_services')
      .where('so.service_order_id = :service_order_id', {
        service_order_id: id,
      })
      .getOne();
  }

  async findById(id: number) {
    return this.serviceOrderRepository.findOne({
      where: {
        service_order_id: id,
      },
    });
  }

  async update(id: number, updateServiceOrderDto: UpdateServiceOrderDto) {
    const updateOrder = await this.serviceOrderRepository.preload({
      service_order_id: id,
      ...updateServiceOrderDto,
    });

    return this.serviceOrderRepository.save(updateOrder);
  }
}
