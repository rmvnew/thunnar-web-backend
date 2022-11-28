import { Category } from './entities/category.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {

    const { category_name } = createCategoryDto

    const create = this.categoryRepository.create(createCategoryDto)

    create.category_name = category_name.toUpperCase()
    create.is_active = true

    return this.categoryRepository.save(create)
  }

  async findAll() {
    return this.categoryRepository.find()
  }

  async findById(id: number): Promise<Category> {
    return this.categoryRepository.findOne({
      where: {
        category_id: id,
        is_active: true
      }
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Category nor found`)
    }

    const { category_name } = updateCategoryDto

    const updateCategory = await this.categoryRepository.preload({
      category_id: id,
      ...updateCategoryDto
    })

    if (category_name) {
      updateCategory.category_name = category_name.toUpperCase()
    }

    return this.categoryRepository.save(updateCategory)
  }

  async changeStatus(id: number) {

    const isRegistered = await this.findById(id)

    if (!isRegistered) {
      throw new NotFoundException(`Category nor found`)
    }

    const { is_active } = isRegistered

    isRegistered.is_active = !isRegistered

    await this.categoryRepository.save(isRegistered)
  }
}
