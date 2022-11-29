import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUser } from './dto/filter.user';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { getUserPath } from 'src/common/routes.path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';


@ApiTags("User")
@Controller('user')
@ApiBearerAuth()

export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  // @PublicRoute()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async create(
    @Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async findAll(
    @Query() filter: FilterUser):Promise<Pagination<User>> {

    filter.route = getUserPath()

    return this.userService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findById(+id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async remove(@Param('id') id: string): Promise<User> {
    return this.userService.changeStatus(+id);
  }
}
