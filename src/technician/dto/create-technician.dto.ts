import { ApiProperty } from '@nestjs/swagger';

export class CreateTechnicianDto {
  @ApiProperty()
  technician_name: string;

  @ApiProperty()
  technician_phone: string;
}
