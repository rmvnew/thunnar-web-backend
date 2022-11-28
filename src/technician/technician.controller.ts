import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Technician')
@Controller('technician')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

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
