import { ProductIngredients } from 'src/products/entities/productIngredients.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100 })
  unit_type: string;

  @Column()
  unit_price: number;

  @Column()
  available: number;

  @OneToMany(() => ProductIngredients, (prodIngred) => prodIngred.ingredient)
  productIngredients: ProductIngredients[];
}
