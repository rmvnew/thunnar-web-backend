import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const { client_name } = createClientDto;
    const createClient = this.clientRepository.create(createClientDto);

    createClient.client_name = client_name.toUpperCase();
    createClient.is_active = true

    return this.clientRepository.save(createClient);
  }

  async findAll() {
    return this.clientRepository.find();
  }

  async finfById(id: number) {
    return this.clientRepository.findOne({
      where: {
        client_id: id,
      },
    });
  }

  async findClientByName(name: string) {
    return this.clientRepository
      .createQueryBuilder('client')
      .where('client.client_name like :client_name', {
        client_name: `%${name}%`,
      });
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    const isRegistered = await this.finfById(id);

    if (!isRegistered) {
      throw new NotFoundException(`Cliente não foi encontrado!`);
    }

    const { client_name, client_phone } = updateClientDto;
    const updateClient = await this.clientRepository.preload({
      client_id: id,
      ...updateClientDto,
    });

    if (client_name) {
      updateClient.client_name = client_name.toUpperCase();
    }

    return this.clientRepository.save(updateClient);
  }

  async changeStatus(id: number) {
    const isRegistered = await this.finfById(id);

    if (!isRegistered) {
      throw new NotFoundException(`Cliente não foi encontrado!`);
    }

    const { is_active } = isRegistered;

    isRegistered.is_active = !is_active;

    return this.clientRepository.save(isRegistered);
  }
}
