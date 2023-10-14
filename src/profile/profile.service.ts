import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService {



  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) { }

  async create(createProfileDto: CreateProfileDto) {


    const { profile_name, profile_id } = createProfileDto

    const create = this.profileRepository.create(createProfileDto)

    create.profile_id = profile_id
    create.profile_name = profile_name.toUpperCase()

    return this.profileRepository.save(create)

  }

  async findAll() {
    return this.profileRepository.find()
  }

  async findByid(id: string) {
    return this.profileRepository.findOne({
      where: {
        profile_id: id
      }
    })
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {

    const isRegistered = await this.findByid(id)

    if (!isRegistered) {
      throw new NotFoundException(`Perfil não encontrado`)
    }

    const { profile_name } = updateProfileDto

    const update = await this.profileRepository.preload({
      profile_id: id,
      ...updateProfileDto
    })

    if (profile_name) {
      update.profile_name = profile_name.toUpperCase()
    }


    return this.profileRepository.save(update)
  }

  async remove(id: string) {

    const isRegistered = await this.findByid(id)

    if (!isRegistered) {
      throw new NotFoundException(`Perfil não encontrado`)
    }

    await this.profileRepository.delete(isRegistered)


  }


  async haveProfile(name: string) {
    return this.profileRepository.findOne({
      where: {
        profile_name: name
      }
    })
  }
}
