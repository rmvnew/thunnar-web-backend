import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('Invoice')
@Controller('invoice')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  async findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.invoiceService.findById(+id);
  }

  @Get('/number/:invoice_number')
  async findBuNumber(
    @Param('invoice_number') invoice_number: string
  ) {
    return this.invoiceService.findByNumber(invoice_number)
  }


}
