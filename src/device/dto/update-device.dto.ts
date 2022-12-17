import { ApiProperty } from '@nestjs/swagger';
import { CreatePartsAndServiceDto } from 'src/parts_and_services/dto/create-parts_and_service.dto';

export class UpdateDeviceDto {

    @ApiProperty()
    device_id: number

    @ApiProperty()
    device_brand: string;

    @ApiProperty()
    device_model: string;

    @ApiProperty({ required: false })
    device_serial_number: string;

    @ApiProperty({ required: false })
    device_imei: string;

    @ApiProperty()
    device_problem_reported: string;

    @ApiProperty({ type: [CreatePartsAndServiceDto], required: false })
    parts_and_services: CreatePartsAndServiceDto[];
}
