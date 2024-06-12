import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../dtos/registerUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn( email: string, password: string ): Promise<{ access_token: string }> {
        const user = await this.userService.findOne(email);
        if(!user) throw new UnauthorizedException();

        // const isMatch = await bcrypt.compare(password, user.password);

        const isMatch = password == user.password;
        if (!isMatch) throw new UnauthorizedException();

        const payload = { sub: user.id, email: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp (newUser: RegisterUserDto) {
        // const salt = await bcrypt.genSalt();
        // const unhashedPassword: string = newUser.password;
        // const hashedPassword: string = await bcrypt.hash(newUser.password, salt);
        // newUser.password = hashedPassword;
        console.log(newUser);
        await this.userService.create(newUser);
        // return this.signIn(newUser.email, unhashedPassword);
        return this.signIn(newUser.email, newUser.password);

    }
}