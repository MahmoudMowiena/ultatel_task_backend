import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterUserDto } from '../../common/dtos/registerUser.dto';
import { SignInUserDto } from '../../common/dtos/signInUser.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInUser: SignInUserDto) {
        return this.authService.signIn(signInUser.email, signInUser.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    signUp(@Body() newUser: RegisterUserDto) {
        return this.authService.signUp(newUser);
    }
}