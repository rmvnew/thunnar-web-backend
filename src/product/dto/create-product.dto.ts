import { ApiProperty } from "@nestjs/swagger"



export class CreateProductDto {


    @ApiProperty()
    product_name: string

    @ApiProperty()
    product_barcode: string

    @ApiProperty()
    product_code: string
    
    @ApiProperty()
    product_location:string

    @ApiProperty()
    product_quantity: number

    @ApiProperty()
    product_quantity_minimal: number

    @ApiProperty()
    product_category_id:number

    @ApiProperty({ required: false })
    product_price: number
    
    @ApiProperty({ required: false })
    invoice_id: number

    @ApiProperty({ required: false })
    product_price_buy: number

    

}
