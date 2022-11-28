import { PartialType } from '@nestjs/swagger';
import { CreateServiceOrderDto } from './create-service_order.dto';

export class UpdateServiceOrderDto extends PartialType(CreateServiceOrderDto) {}
