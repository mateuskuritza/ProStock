import { IsNotEmpty, Min, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Min(6)
  @IsNotEmpty()
  password: string;
}
