import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InvoiceService {

  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>
  ) { }

  async create(createInvoiceDto: CreateInvoiceDto) {

    const { invoice_number } = createInvoiceDto
    const isRegistered = await this.findByNumber(invoice_number)
    if (isRegistered) {
      throw new BadRequestException(`The invoice is already registered`)
    }
    const createInvoice = this.invoiceRepository.create(createInvoiceDto)

    return this.invoiceRepository.save(createInvoice)
  }

  async findByNumber(number: string) {
    return this.invoiceRepository.findOne({
      where: {
        invoice_number: number
      }
    })
  }

  async findAll() {
    return this.invoiceRepository.find()
  }

  async findById(id: number): Promise<Invoice> {

    return this.invoiceRepository.findOne({
      where: {
        invoice_id: id
      }
    })

  }

}
