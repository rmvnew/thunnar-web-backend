import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { sendMail } from 'src/common/email';
import { SortingType, ValidType } from 'src/common/Enums';
import { hash } from 'src/common/hash';

import { Validations } from 'src/common/validations';
import { ProfileService } from 'src/profile/profile.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterMail } from './dto/filter.mail';
import { FilterUser } from './dto/filter.user';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CheckCpf } from '../common/validate.cpf';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profileService: ProfileService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { user_password, user_name, user_email, user_profile_id, user_cpf } =
      createUserDto;

    if (!CheckCpf.getInstance().isCpf(user_cpf)) {
      throw new BadRequestException(`O cpf informado é inválido!!`);
    }

    const currentUser = this.userRepository.create(createUserDto);

    currentUser.user_password = await hash(user_password);
    currentUser.user_name = user_name.toUpperCase();

    Validations.getInstance().validateWithRegex(
      user_name,
      ValidType.NO_SPECIAL_CHARACTER,
      ValidType.IS_STRING,
      ValidType.NO_MANY_SPACE,
    );

    Validations.getInstance().validateWithRegex(user_email, ValidType.IS_EMAIL);

    const userIsRegistered = await this.findByName(currentUser.user_name);

    if (userIsRegistered) {
      throw new BadRequestException(`user already registered`);
    }

    const emailIsRegistered = await this.findByEmail(user_email);

    if (emailIsRegistered) {
      throw new BadRequestException(`email already registered`);
    }

    if (!user_profile_id) {
      throw new BadRequestException(`Profile not found`)
    }

    const profile = await this.profileService.findByid(user_profile_id);
    if (!profile) {
      throw new NotFoundException(`Perfil não encontrado`);
    }

    currentUser.profile = profile;

    currentUser.is_active = true;
    currentUser.user_first_access = true;
    currentUser.create_at = new Date();
    currentUser.update_at = new Date();
    currentUser.user_cpf = user_cpf.replace(/[^\d]+/g, '');

    return this.userRepository.save(currentUser);
  }

  async findByEmail(userEmail: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: userEmail })
      .getOne();
  }

  async findByName(name: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        user_name: name,
        is_active: true,
      },
    });
  }

  async findAll(filter: FilterUser): Promise<Pagination<User>> {
    const { sort, orderBy, user_name } = filter;

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')


    if (user_name) {
      queryBuilder.where(`user.user_name like :user_name`, {
        user_name: `%${user_name}%`,
      });
    }

    if (orderBy == SortingType.ID) {
      queryBuilder.orderBy(
        'user.user_id',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    } else {
      queryBuilder.orderBy(
        'user.user_name',
        `${sort === 'DESC' ? 'DESC' : 'ASC'}`,
      );
    }

    queryBuilder.andWhere('user.is_active <> false');

    const page = await paginate<User>(queryBuilder, filter);

    page.links.first =
      page.links.first === ''
        ? ''
        : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
    page.links.previous =
      page.links.previous === ''
        ? ''
        : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
    page.links.last =
      page.links.last === ''
        ? ''
        : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
    page.links.next =
      page.links.next === ''
        ? ''
        : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

    return page;
  }

  async findById(id: number): Promise<User> {
    return (
      this.userRepository
        .createQueryBuilder('inf')
        .leftJoinAndSelect('inf.profile', 'profile')
        .where('inf.user_id = :user_id', { user_id: id })
        // .andWhere('inf.is_active = true')
        .getOne()
    );
  }

  async findByCpf(cpf: string) {

    const currentCpf = cpf.replace(/[^\d]+/g, '');

    return this.userRepository.findOne({
      where: {
        user_cpf: currentCpf,
        is_active: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const isRegistered = await this.findById(id);

    if (!isRegistered) {
      throw new NotFoundException(`User not found`);
    }

    const { user_name, user_email, user_cpf } = updateUserDto;

    const currentUser = await this.userRepository.preload({
      user_id: id,
      ...updateUserDto,
    });

    if (user_name) {
      Validations.getInstance().validateWithRegex(
        user_name,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_STRING,
        ValidType.NO_MANY_SPACE,
      );

      currentUser.user_name = user_name.toUpperCase();
    }

    if (user_email) {
      Validations.getInstance().validateWithRegex(
        user_email,
        ValidType.IS_EMAIL,
      );

      currentUser.user_email = user_email;
    }

    if (user_cpf) {
      if (!CheckCpf.getInstance().isCpf(user_cpf)) {
        throw new BadRequestException(`O cpf informado é inválido!!`);
      }

      currentUser.user_cpf = user_cpf.replace(/[^\d]+/g, '');
    }

    return this.userRepository.save(currentUser);
  }

  async changeStatus(id: number): Promise<User> {
    const isRegistered = await this.findById(id);

    if (!isRegistered) {
      throw new NotFoundException(`User not found`);
    }

    const { is_active } = isRegistered;

    isRegistered.is_active = is_active == true ? false : true;

    return this.userRepository.save(isRegistered);
  }

  async updateRefreshToken(id: number, refresh_token: string) {

    Validations.getInstance().validateWithRegex(`${id}`, ValidType.IS_NUMBER);

    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`user with id ${id} does not exist`);
    }

    user.user_refresh_token = refresh_token;

    await this.userRepository.save(user);
  }

  async sendMail(filterMail: FilterMail) {
    const { message } = filterMail;

    sendMail(message);
  }

  async changePassword(cpf: string, password: string) {

    const user = await this.findByCpf(cpf);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    user.user_password = await hash(password);

    this.userRepository.save(user);
  }

  async getIdByName(name: string) {
    return this.userRepository.query(`select user_id from tb_user where user_name = '${name}'`)
  }
}
