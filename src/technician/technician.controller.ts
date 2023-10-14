import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessProfile } from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { TechnicianService } from './technician.service';

@ApiTags('Technician')
@Controller('technician')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))


export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) { }

  @Post()
  async create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.technicianService.create(createTechnicianDto);
  }

  @Get()
  async findAll() {
    return this.technicianService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.technicianService.findById(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    return this.technicianService.update(+id, updateTechnicianDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.technicianService.changeStatus(+id);
  }
}
