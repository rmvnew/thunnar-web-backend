import { ApiProperty } from '@nestjs/swagger';
import { CreateDeviceDto } from '../../device/dto/create-device.dto';

export class CreateServiceOrderDto {
  @ApiProperty({ required: true })
  client_id: number;

  @ApiProperty({ required: true })
  user_id: string;

  @ApiProperty({ required: false })
  technician_id: number;

  @ApiProperty({ type: [CreateDeviceDto] })
  devices: CreateDeviceDto[];
}
