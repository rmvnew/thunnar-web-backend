import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { FilterSale } from './dto/filter.sale';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Sale } from './entities/sale.entity';
import { getSalePath } from '../common/routes.path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';

@ApiTags('Sale')
@Controller('sale')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @Get()
  findAll(@Query() filter: FilterSale): Promise<Pagination<Sale>> {
    filter.route = getSalePath();

    return this.saleService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saleService.findById(+id);
  }

  
}
