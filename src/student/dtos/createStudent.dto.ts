import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    birthDate: Date;

    @IsString()
    @IsIn(['Male', 'Female'])
    @IsNotEmpty()
    gender: 'Male' | 'Female';

    @IsString()
    @IsNotEmpty()
    country: string;
}