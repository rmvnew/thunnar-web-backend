import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreatePartsAndServiceDto } from '../parts_and_services/dto/create-parts_and_service.dto';
import { CreateServiceOrderDto } from './dto/create-service_order.dto';
import { UpdateServiceOrderDto } from './dto/update-service_order.dto';
import { ServiceOrderService } from './service_order.service';

import { AccessProfile } from 'src/auth/enums/permission.type';
import { OrderStatus } from 'src/common/Enums';
import { getServiceOrderPath } from '../common/routes.path';
import { FilterServiceOrder } from './dto/service-order.filter';


@ApiTags('Service Order')
@Controller('service-order')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class ServiceOrderController {
  constructor(private readonly serviceOrderService: ServiceOrderService) { }

  @Post()
  async create(@Body() createServiceOrderDto: CreateServiceOrderDto) {
    return this.serviceOrderService.create(createServiceOrderDto);
  }

  @Get()
  async findAll(
    @Query() filter: FilterServiceOrder
  ) {
    filter.route = getServiceOrderPath();
    return this.serviceOrderService.findAll(filter);
  }

  @Post('/pos/:device_id')
  async addPartsAnServicesInDevice(
    @Param('device_id') device_id: number,
    @Body() pos: CreatePartsAndServiceDto,
  ) {
    this.serviceOrderService.addNewPartsAndServicesInDevice(device_id, pos);
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

  @Patch('/change-status/:id/:orderStatus')
  async changeStatusorder(
    @Param('id') id: number,
    @Param('orderStatus') orderStatus: OrderStatus,
  ) {
    this.serviceOrderService.changeStatusOrder(id, orderStatus)
  }


  @Delete(':id')
  async deleteOrder(
    @Param('id') id: number
  ) {
    return this.serviceOrderService.deleteOrder(id)
  }

}
