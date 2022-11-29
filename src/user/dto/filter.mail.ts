import { ApiProperty } from '@nestjs/swagger';

export class FilterMail {
  @ApiProperty({ required: false })
  message: string;
}
