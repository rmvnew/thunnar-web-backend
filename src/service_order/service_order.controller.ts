import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ServiceOrderService } from './service_order.service';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreatePartsAndServiceDto } from '../parts_and_services/dto/create-parts_and_service.dto';

@ApiTags('Service Order')
@Controller('service-order')
export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) {}

  @Post()
  async create(@Body() createServiceOrderDto: CreateServiceOrderDto) {
    return this.serviceOrderService.create(createServiceOrderDto);
  }

  @Post('/pos/:device_id')
  async addPartsAnServicesInDevice(
    @Param('device_id') device_id: number,
    @Body() pos: CreatePartsAndServiceDto,
  ) {
    this.serviceOrderService.addNewPartsAndServicesInDevice(device_id, pos);
  }

  @Get()
  async findAll() {
    return this.serviceOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serviceOrderService.findById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateServiceOrderDto: UpdateServiceOrderDto,
  ) {
    return this.serviceOrderService.update(+id, updateServiceOrderDto);
  }
}
