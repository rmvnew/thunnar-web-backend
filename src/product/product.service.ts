import { FilterProduct } from './dto/filter.product';
import { Product } from './entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Brackets, Repository } from 'typeorm';
import { SortingType } from 'src/common/Enums';
import { paginate } from 'nestjs-typeorm-paginate';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class ProductService {


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly invoiceService: InvoiceService
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {

    const { product_name, product_location, invoice_id } = createProductDto


    const createProduct = this.productRepository.create(createProductDto)

    if (invoice_id) {
      const currentInvoice = await this.invoiceService.findById(invoice_id)
      if (!currentInvoice) {
        throw new NotFoundException(`Invoice not found`)
      }
      createProduct.invoce = currentInvoice
    }

    createProduct.product_name = product_name.toUpperCase()
    createProduct.product_location = product_location.toUpperCase()

    createProduct.is_active = true


    return this.productRepository.save(createProduct)


  }


  async findAll(filter: FilterProduct) {
    const { sort, orderBy, search } = filter;

    const queryBuilder = this.productRepository.createQueryBuilder('prod')
      .leftJoinAndSelect('prod.category', 'category')

    if (search) {

      queryBuilder
        .where('prod.product_name like :product_name', { product_name: `%${search}%` })
        .orWhere('prod.product_barcode like :product_barcode', { product_barcode: `%${search}%` })

    }

    if (orderBy == SortingType.ID) {
      queryBuilder.orderBy(
        'prod.product_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    } else {
      queryBuilder.orderBy(
        'prod.product_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    }

    queryBuilder.andWhere("prod.is_active <> false") 

    const page = await paginate<Product>(queryBuilder, filter);

    page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
    page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
    page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
    page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

    return page;
  }

  async findById(id: number) {
    return this.productRepository.findOne({
      where: {
        product_id: id,
        is_active: true
      }
    })
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const { product_name, product_location } = updateProductDto

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Produto não encontrado!`)
    }

    const createUpdate = await this.productRepository.preload({
      product_id: id,
      ...updateProductDto
    })


    if (product_name) {
      createUpdate.product_name = product_name.toUpperCase()
    }

    if (product_location) {
      createUpdate.product_location = product_location.toUpperCase()
    }


    return this.productRepository.save(createUpdate)
  }


  async remove(id: number) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Produto não encontrado!`)
    }

    const { is_active } = isRegistered

    isRegistered.is_active = !is_active

    return this.productRepository.save(isRegistered)
  }
}
