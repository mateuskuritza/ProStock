import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductIngredients } from './productIngredients.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column()
  price: number;

  @OneToMany(() => ProductIngredients, (prodIngred) => prodIngred.product)
  productIngredients: ProductIngredients[];
}
