import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  //ValidateNested,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  middleName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserSignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // TODO: Implement password policy
  @IsNotEmpty()
  @IsString()
  password: string;
}

//

export class CreateUserDto {}
