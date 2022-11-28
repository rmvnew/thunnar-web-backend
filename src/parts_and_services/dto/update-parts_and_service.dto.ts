import { PartialType } from '@nestjs/swagger';
import { CreatePartsAndServiceDto } from './create-parts_and_service.dto';

export class UpdatePartsAndServiceDto extends PartialType(CreatePartsAndServiceDto) {}
