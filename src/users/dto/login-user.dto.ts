import { IsNotEmpty, IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Length(6, 100)
  @IsNotEmpty()
  password: string;
}
