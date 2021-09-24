import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Repository } from 'typeorm';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductIngredients } from './entities/productIngredients.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
    @InjectRepository(ProductIngredients)
    private readonly productIngredientsRepository: Repository<ProductIngredients>,
  ) {}

  async create(createIngredientDto: CreateProductDto) {
    await this.validProductName(createIngredientDto.name);
    return this.productRepository.save(createIngredientDto);
  }

  async findAll() {
    return this.productRepository.find({
      relations: ['productIngredients', 'productIngredients.ingredient'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException('Not found product');
    return product;
  }

  async update(id: number, newProduct: UpdateProductDto) {
    const product = await this.findOne(id);

    await this.validProductName(newProduct.name, id);

    product.name = newProduct?.name;
    product.price = newProduct?.price;

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (!product) throw new NotFoundException();
    await this.productRepository.delete(id);
    throw new HttpException('Successfully deleted', 204);
  }

  async validProductName(name: string, id = -1) {
    // pass product id as parameter if updating product
    const product = await this.productRepository.findOne({ name });
    if (product && product.id !== id)
      throw new ConflictException('Existing product name');
  }

  async addIngredient(infos: AddIngredientDto) {
    const { productId, ingredientId, ingredient_units } = infos;

    await this.findOne(productId);
    const ingredient = await this.ingredientRepository.findOne({
      id: ingredientId,
    });
    if (!ingredient) throw new NotFoundException('Not found ingredient');

    return this.productIngredientsRepository.save({
      productId,
      ingredientId,
      ingredient_units,
    });
  }

  async productIngredients(id: number) {
    return this.productIngredientsRepository.find({
      where: { productId: id },
      relations: ['ingredient'],
    });
  }
}
