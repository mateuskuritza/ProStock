import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  unit_type: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  unit_price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  available: number;
}
