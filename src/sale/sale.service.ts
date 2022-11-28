import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './entities/sale.entity';
import { Repository } from 'typeorm';
import { FilterSale } from './dto/filter.sale';
import { SortingType } from 'src/common/Enums';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { UserService } from '../user/user.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    private readonly userService: UserService,
  ) {}

  async create(createSaleDto: CreateSaleDto) {
    const { products, sale_value, user_id } = createSaleDto;

    const currentUser = await this.userService.findById(user_id);

    if (products.length == 0) {
      throw new BadRequestException(`Nenhum produto adicionado a venda`);
    }

    const createSale = this.saleRepository.create(createSaleDto);

    createSale.user = currentUser;
    createSale.products = products;
    createSale.sale_value = sale_value;

    return this.saleRepository.save(createSale);
  }

  async findAll(filter: FilterSale): Promise<Pagination<Sale>> {
    const { sort, orderBy } = filter;

    const queryBuilder = this.saleRepository.createQueryBuilder('sale');

    if (orderBy == SortingType.ID) {
      queryBuilder.orderBy(
        'sale.sale_id',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    } else {
      queryBuilder.orderBy(
        'sale.sale_date',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    }

    queryBuilder.andWhere('user.is_active <> false');

    const page = await paginate<Sale>(queryBuilder, filter);

    page.links.first =
      page.links.first === ''
        ? ''
        : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
    page.links.previous =
      page.links.previous === ''
        ? ''
        : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
    page.links.last =
      page.links.last === ''
        ? ''
        : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
    page.links.next =
      page.links.next === ''
        ? ''
        : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

    return page;
  }

  async findById(id: number) {
    return this.saleRepository.findOne({
      where: {
        sale_id: id,
      },
    });
  }
}
