import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MatchPasswords } from "src/common/decorators/match-passwords.decorators";

export class RegisterUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @MatchPasswords('password', {
        message: 'Password and confirm password do not match',
    })
    confirmPassword: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}