import { FilterPagination } from './../../common/filter.pagination';
import { ApiProperty } from "@nestjs/swagger";





export class FilterProduct extends FilterPagination{


    @ApiProperty({required:false})
    search: string

    
    

}