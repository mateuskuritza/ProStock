import {
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createIngredientDto: CreateProductDto) {
    await this.validProductName(createIngredientDto.name);
    return this.productRepository.save(createIngredientDto);
  }

  async findAll() {
    return this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException();
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
}
