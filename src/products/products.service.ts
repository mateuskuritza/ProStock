import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { join } from 'path';
import { Ingredient } from '../ingredients/entities/ingredient.entity';
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
    const products = await this.productRepository.find({
      relations: ['productIngredients', 'productIngredients.ingredient'],
    });

    const productsOverview: any[] = [];

    products.forEach((product) => {
      const { available, cost } = this.costAndAvailability(
        product.productIngredients,
      );
      const { productIngredients, ...rest } = product;

      productsOverview.push({
        ...rest,
        available,
        cost,
      });
    });

    return productsOverview;
  }

  async findOne(id: number) {
    // Relations => Select the ingredients of the product and its characteristics
    const product = await this.productRepository.findOne(id, {
      relations: ['productIngredients', 'productIngredients.ingredient'],
    });
    if (!product) throw new NotFoundException('Not found product');

    const { available, cost } = this.costAndAvailability(
      product.productIngredients,
    );

    return { availableProduct: available, productCost: cost, ...product };
  }

  costAndAvailability(productIngredients: ProductIngredients[]) {
    // Calculates availability and cost from the ingredients registered in the product
    let available = true;
    let cost = 0;

    productIngredients.forEach((productIngredient) => {
      const ingredient = productIngredient.ingredient;
      const necessaryQuantity = productIngredient.ingredientUnits;
      const availableQuantity = ingredient.available;

      if (necessaryQuantity > availableQuantity) available = false;

      cost += ingredient.unitPrice * necessaryQuantity;
    });

    return { available, cost };
  }

  async update(id: number, newProduct: UpdateProductDto) {
    const product = await this.productRepository.findOne(id);

    await this.validProductName(newProduct.name);

    product.name = newProduct?.name;
    product.price = newProduct?.price;

    return this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException();
    await this.productRepository.delete(id);
    throw new HttpException('Successfully deleted', 204);
  }

  async validProductName(name: string) {
    const product = await this.productRepository.findOne({ name });
    if (product) throw new ConflictException('Existing product name');
  }

  async addIngredient(infos: AddIngredientDto) {
    const { productId, ingredientId, ingredientUnits } = infos;

    await this.productRepository.findOne(productId);

    const ingredient = await this.ingredientRepository.findOne({
      id: ingredientId,
    });
    if (!ingredient) throw new NotFoundException('Not found ingredient');

    const existingRelation = await this.productIngredientsRepository.findOne({
      where: { productId, ingredientId },
    });

    // If existing relation => Updates
    if (existingRelation) {
      existingRelation.ingredientUnits = ingredientUnits;
      return this.productIngredientsRepository.save(existingRelation);
    }

    return this.productIngredientsRepository.save({
      productId,
      ingredientId,
      ingredientUnits,
    });
  }

  async createOrUpdateImage(id: number, file: Express.Multer.File) {
    const product = await this.findOne(id);
    product.imageName = file.filename;
    return this.productRepository.save(product);
  }

  async findImage(productId: number, res: Response) {
    const product = await this.findOne(productId);

    if (!product.imageName)
      throw new NotFoundException('This product does not have an image yet');

    return res.sendFile(
      join(process.cwd(), '../uploads/product-images/' + product.imageName),
    );
  }
}
