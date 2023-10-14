import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AccessProfile } from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { getSalePath } from '../common/routes.path';
import { CreateSaleDto } from './dto/create-sale.dto';
import { FilterSale } from './dto/filter.sale';
import { Sale } from './entities/sale.entity';
import { SaleService } from './sale.service';

@ApiTags('Sale')
@Controller('sale')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class SaleController {
  constructor(private readonly saleService: SaleService) { }

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
