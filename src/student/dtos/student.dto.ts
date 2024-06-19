import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StudentDto {

    @IsNumber()
    id: number;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    birthDate: Date;

    @IsString()
    @IsIn(['Male', 'Female'])
    gender: 'Male' | 'Female';

    @IsString()
    country: string;
}