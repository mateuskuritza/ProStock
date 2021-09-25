import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class AddIngredientDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  ingredientId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  ingredientUnits: number;
}
