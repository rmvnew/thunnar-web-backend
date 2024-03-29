import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessProfile } from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { UpdatePartsAndServiceDto } from './dto/update-parts_and_service.dto';
import { PartsAndServicesService } from './parts_and_services.service';

@Controller('parts-and-services')
@ApiTags('PAS')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class PartsAndServicesController {
  constructor(private readonly partsAndServicesService: PartsAndServicesService) { }

  // @Post()
  // create(@Body() createPartsAndServiceDto: CreatePartsAndServiceDto) {
  //   return this.partsAndServicesService.create(createPartsAndServiceDto);
  // }

  @Get()
  findAll() {
    return this.partsAndServicesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.partsAndServicesService.findOne(+id);
  // }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePartsAndServiceDto: UpdatePartsAndServiceDto) {
    return this.partsAndServicesService.update(+id, updatePartsAndServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partsAndServicesService.remove(+id);
  }
}
