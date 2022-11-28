import { ApiProperty } from "@nestjs/swagger";

export class CreatePartsAndServiceDto {
    @ApiProperty()
    pas_description: string;
  
    @ApiProperty()
    pas_quantity: number;
  
    @ApiProperty()
    pas_price: number;
}
