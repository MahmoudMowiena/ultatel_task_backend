import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStudentDto {

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    age: number;

    @IsString()
    @IsIn(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @IsString()
    country: string;
}