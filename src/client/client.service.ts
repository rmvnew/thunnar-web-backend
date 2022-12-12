import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { CheckCpf } from '../common/validate.cpf';
import { Validations } from 'src/common/validations';
import { ValidType } from 'src/common/Enums';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async create(createClientDto: CreateClientDto) {
    const { client_name, client_cpf, client_phone } = createClientDto;
    const createClient = this.clientRepository.create(createClientDto);

    const isCpf = CheckCpf.getInstance().isCpf(client_cpf)

    if (!isCpf) {
      throw new BadRequestException(`Número de cpf inválido`)
    }

    Validations.getInstance().validateWithRegex(
      client_phone,
      ValidType.IS_NUMBER
    )

    Validations.getInstance().verifyLength(
      client_phone,
      'phone number',
      11,11
    )

    createClient.client_name = client_name.toUpperCase();
    createClient.client_cpf = client_cpf.replace(/[^\d]+/g, '')
    createClient.is_active = true

    const clientSaved = await this.clientRepository.save(createClient).then(response => {
      return response
    }).catch(error => {
      if (error.sqlMessage.indexOf('Duplicate entry') >= 0) {
        throw new BadRequestException(`Cliente já cadastrado`)
      }
    })

    return clientSaved
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

  async findByCpf(cpf: string): Promise<Client> {
    return this.clientRepository.findOne({
      where: {
        client_cpf: cpf,
        is_active: true
      }
    })
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
