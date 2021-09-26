import { Ingredient } from '../../ingredients/entities/ingredient.entity';
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
  ingredientUnits: number;

  @ManyToOne(() => Product, (product) => product.productIngredients, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.productIngredients, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  ingredient: Ingredient;
}
