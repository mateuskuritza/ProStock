import { forwardRef, Module } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { ProductIngredients } from '../products/entities/productIngredients.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, ProductIngredients])],
  controllers: [IngredientsController],
  providers: [IngredientsService],
})
export class IngredientsModule {}
