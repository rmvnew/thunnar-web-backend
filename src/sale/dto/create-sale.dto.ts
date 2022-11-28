import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';

export class CreateSaleDto {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  sale_value: number;

  @ApiProperty({type:[Product]})
  products: Product[];
}
