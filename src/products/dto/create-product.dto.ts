import { IsNumber, IsString, IsNotEmpty, Length, Min } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;
}
