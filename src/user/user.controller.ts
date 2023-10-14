import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AccessProfile } from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { getUserPath } from 'src/common/routes.path';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterMail } from './dto/filter.mail';
import { FilterUser } from './dto/filter.user';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()



export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  // @PublicRoute()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async findAll(@Query() filter: FilterUser): Promise<Pagination<User>> {
    filter.route = getUserPath();

    return this.userService.findAll(filter);
  }

  @Post('/mail')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async sendMail(@Query() filterMail: FilterMail) {
    this.userService.sendMail(filterMail);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Get('get-id/:name')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async findIdByName(@Param('name') name: string) {
    return this.userService.getIdByName(name)
  }



  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.changeStatus(id);
  }

  @Patch('/changePassword/:cpf/:pass')
  // @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  @PublicRoute()
  async changePassword(@Param('cpf') cpf: string, @Param('pass') pass: string) {
    this.userService.changePassword(cpf, pass);
  }


}
