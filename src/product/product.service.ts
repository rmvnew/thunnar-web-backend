import { FilterProduct } from './dto/filter.product';
import { Product } from './entities/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { SortingType } from 'src/common/Enums';
import { paginate } from 'nestjs-typeorm-paginate';
import { InvoiceService } from '../invoice/invoice.service';
import { products } from './products';



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

      let invoices = []
      const currentInvoice = await this.invoiceService.findById(invoice_id)

      if (!currentInvoice) {
        throw new NotFoundException(`Invoice not found`)
      }

      invoices.push(currentInvoice)
      createProduct.invoce = invoices
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
    return this.productRepository.query(`select * from tb_product where product_id = ${id}`)
  }

  async update(id: number, updateProductDto: UpdateProductDto) {



    const { product_name, product_location, invoice_id } = updateProductDto



    const isRegistered = await this.findById(id)




    if (!isRegistered) {
      throw new NotFoundException(`Produto não encontrado!`)
    }



    const createUpdate = await this.productRepository.preload({
      product_id: id,
      ...updateProductDto
    })

    if (invoice_id) {

      let invoices = []
      const currentInvoice = await this.invoiceService.findById(invoice_id)

      if (!currentInvoice) {
        throw new NotFoundException(`Invoice not found`)
      }

      invoices.push(currentInvoice)
      createUpdate.invoce = invoices
    }


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



  async operation() {

    products.forEach(data => {

      const prod: CreateProductDto = {
        invoice_id: data.id,
        product_name: data.name,
        product_barcode: `${data.barcode}`,
        product_code: `${data.code}`,
        product_location: data.location,
        product_quantity: data.quantity,
        product_quantity_minimal: data.minimal_quantity,
        product_category_id: data.category,
        product_purchase_price: data.product_pryce,
        product_sale_price: data.product_pryce_buy

      }

      const create = this.productRepository.create(prod)
      create.is_active = true
      

      this.productRepository.save(create)


    })

  }

}
