import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductIngredients } from './entities/productIngredients.entity';
import { Ingredient } from 'src/ingredients/entities/ingredient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductIngredients, Ingredient]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
