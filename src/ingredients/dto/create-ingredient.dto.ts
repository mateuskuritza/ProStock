import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateIngredientDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  unitType: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  available: number;
}
