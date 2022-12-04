import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Product]),
    InvoiceModule
  ],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
