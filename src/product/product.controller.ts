import { FilterProduct } from './dto/filter.product';
import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { getProductPath } from 'src/common/routes.path';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Product")
@Controller('product')

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
}
