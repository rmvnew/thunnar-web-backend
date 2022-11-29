import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PartsAndServicesService } from './parts_and_services.service';
import { CreatePartsAndServiceDto } from './dto/create-parts_and_service.dto';
import { UpdatePartsAndServiceDto } from './dto/update-parts_and_service.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@Controller('parts-and-services')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class PartsAndServicesController {
  constructor(private readonly partsAndServicesService: PartsAndServicesService) {}

  @Post()
  create(@Body() createPartsAndServiceDto: CreatePartsAndServiceDto) {
    return this.partsAndServicesService.create(createPartsAndServiceDto);
  }

  @Get()
  findAll() {
    return this.partsAndServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partsAndServicesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartsAndServiceDto: UpdatePartsAndServiceDto) {
    return this.partsAndServicesService.update(+id, updatePartsAndServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsAndServicesService.remove(+id);
  }
}
