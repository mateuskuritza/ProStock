import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 100 })
  unit_type: string;

  @Column()
  unit_price: number;

  @Column()
  available: number;
}
