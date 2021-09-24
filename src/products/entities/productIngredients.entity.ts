import { Ingredient } from 'src/ingredients/entities/ingredient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('products-ingredients')
export class ProductIngredients {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  ingredientId: number;

  @Column()
  ingredient_units: number;

  @ManyToOne(() => Product, (product) => product.productIngredients)
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients)
  ingredient: Ingredient;
}
