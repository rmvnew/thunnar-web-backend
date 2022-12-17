import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';
import { ServiceOrder } from './entities/service_order.entity';
import { DeviceStatus, OrderStatus, SortingType } from '../common/Enums';
import { Utils } from '../common/Utils';
import { Device } from 'src/device/entities/device.entity';
import { PartsAndService } from '../parts_and_services/entities/parts_and_service.entity';
import { CreatePartsAndServiceDto } from '../parts_and_services/dto/create-parts_and_service.dto';
import { ClientService } from '../client/client.service';
import { TechnicianService } from '../technician/technician.service';
import { UserService } from 'src/user/user.service';
import { FilterServiceOrder } from './dto/service-order.filter';
import { paginate } from 'nestjs-typeorm-paginate';

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
  ) { }

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

    createOrder.service_order_number = max === null ? 1 : max + 1;

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

  async findAll(filter: FilterServiceOrder) {
    

    const { sort, orderBy, search } = filter;

    const queryBuilder = this.serviceOrderRepository.createQueryBuilder('so')
      .leftJoinAndSelect('so.client', 'client')
      .leftJoinAndSelect('so.devices', 'devices')
      .leftJoinAndSelect('so.technician', 'technician')


    if (search) {
      queryBuilder.where(`client.client_name like :client_name`, { client_name: `%${search}%` });
    }

    if (orderBy == SortingType.ID) {
      queryBuilder.orderBy(
        'so.service_order_id',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    } else {
      queryBuilder.orderBy(
        'client.client_name',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    }



    const page = await paginate<ServiceOrder>(queryBuilder, filter);

    page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
    page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
    page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
    page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

    return page;
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

    const { devices } = updateServiceOrderDto

    const updateOrder = await this.serviceOrderRepository.preload({
      service_order_id: id,
      ...updateServiceOrderDto,
    });

    if (devices) {


      console.log('Devices', devices);

      let currentDevices = [];

      for (let device of devices) {

        let currentDevice: Device = new Device()

        if (device.device_id != 0) {
          currentDevice = await this.deviceRepository.preload({
            device_id: device.device_id,
            ...devices
          })

        }

        currentDevice.device_brand = device.device_brand;
        currentDevice.device_model = device.device_model;
        currentDevice.device_serial_number = device.device_serial_number;
        currentDevice.device_imei = device.device_imei;
        currentDevice.device_problem_reported = device.device_problem_reported;
        currentDevice.device_status = DeviceStatus.RECEIVED;

        if (device.parts_and_services) {



          let currentPartsAndServices = [];

          for (let pos of device.parts_and_services) {

            let currentPos: PartsAndService = new PartsAndService();

            if (pos.pas_id != 0) {

              currentPos = await this.partsAndServiceRepository.preload({
                pas_id: pos.pas_id,
                ...device.parts_and_services
              })

            }

            currentPos.is_active = true;
            currentPos.pas_description = pos.pas_description;
            currentPos.pas_quantity = pos.pas_quantity;
            currentPos.pas_price = pos.pas_price;

            const currentPosSaved = await this.partsAndServiceRepository.save(
              currentPos
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

      updateOrder.devices = currentDevices
    }

    return this.serviceOrderRepository.save(updateOrder);
  }
}
