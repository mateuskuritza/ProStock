import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    await this.validIngredientName(createIngredientDto.name);
    return this.ingredientRepository.save(createIngredientDto);
  }

  async findAll() {
    return this.ingredientRepository.find();
  }

  async findOne(id: number) {
    const ingredient = await this.ingredientRepository.findOne(id);
    if (!ingredient) throw new NotFoundException();
    return ingredient;
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.findOne(id);
    await this.validIngredientName(updateIngredientDto.name);
    if (!ingredient) throw new NotFoundException();

    ingredient.unitPrice = updateIngredientDto?.unitPrice;
    ingredient.available = updateIngredientDto?.available;
    ingredient.name = updateIngredientDto?.name;

    return this.ingredientRepository.save(ingredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    if (!ingredient) throw new NotFoundException();
    await this.ingredientRepository.delete(id);
    throw new HttpException('Successfully deleted', 204);
  }

  async validIngredientName(name: string) {
    const ingredient = await this.ingredientRepository.findOne({ name });
    if (ingredient) throw new ConflictException('Existing ingredient name');
  }
}
