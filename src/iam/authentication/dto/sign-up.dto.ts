import { IsEmail, IsInt, Max, Min, MinLength } from 'class-validator';

export class SignUpDto {
  @IsInt()
  @Min(5)
  @Max(100)
  age: number;

  @IsEmail()
  email: string;

  @MinLength(10)
  password: string;
}
