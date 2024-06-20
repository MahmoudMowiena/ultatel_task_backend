import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}