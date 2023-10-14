import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccessProfile } from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { getProductPath } from 'src/common/routes.path';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProduct } from './dto/filter.product';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@ApiTags("Product")
@Controller('product')
@ApiBearerAuth()
@UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))

export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query() filter: FilterProduct
  ) {

    filter.route = getProductPath()

    return this.productService.findAll(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }


  @Post('/call')
  async callOperation() {
    this.productService.operation()
  }

}
