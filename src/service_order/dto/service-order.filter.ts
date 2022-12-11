import { ApiProperty } from "@nestjs/swagger";
import { FilterPagination } from "src/common/filter.pagination";



export class FilterServiceOrder extends FilterPagination {

    @ApiProperty({required:false})
    search: string

}