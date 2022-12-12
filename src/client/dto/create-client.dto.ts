import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty()
  client_name: string;

  @ApiProperty()
  client_phone: string;

  @ApiProperty()
  client_cpf:string
}
