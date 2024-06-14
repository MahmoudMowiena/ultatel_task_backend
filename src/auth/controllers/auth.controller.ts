import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
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

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}