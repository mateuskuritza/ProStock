import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientRepository.findOne({
      name: createIngredientDto.name,
    });
    if (ingredient) throw new ConflictException('existing ingredient name');
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

  async changeAvailableQuantity(id: number, newAvailableQuantity) {
    const ingredient = await this.findOne(id);
    if (!ingredient) throw new NotFoundException();
    ingredient.available = newAvailableQuantity;
    return this.ingredientRepository.save(ingredient);
  }

  async remove(id: number) {
    const ingredient = await this.findOne(id);
    if (!ingredient) throw new NotFoundException();
    await this.ingredientRepository.delete(id);
    throw new HttpException('Successfully deleted', 204);
  }
}
