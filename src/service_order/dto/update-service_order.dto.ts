import { ApiProperty } from '@nestjs/swagger';
import { UpdateDeviceDto } from 'src/device/dto/update-device.dto';

export class UpdateServiceOrderDto {
    @ApiProperty({ required: true })
    client_id: number;

    @ApiProperty({ required: true })
    user_id: number;

    @ApiProperty({ required: false })
    technician_id: number;

    @ApiProperty({ type: [UpdateDeviceDto] })
    devices: UpdateDeviceDto[];
}
