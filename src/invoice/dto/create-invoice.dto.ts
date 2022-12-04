import { ApiProperty } from "@nestjs/swagger"

export class CreateInvoiceDto {
    @ApiProperty()
    invoice_number: string

    @ApiProperty()
    invoice_value: number
}
