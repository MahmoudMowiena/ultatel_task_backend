import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../../common/dtos/registerUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException();

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) throw new UnauthorizedException();

        const payload = { email: user.email, firstName: user.firstName, lastName: user.lastName };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(newUser: RegisterUserDto) {
        const { email, password, confirmPassword } = newUser;

        if (password !== confirmPassword) {
            throw new BadRequestException('passwords do not match');
        }

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new ConflictException('email already registered');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(password, salt);
        newUser.password = hashedPassword;

        const addedUser = await this.userService.create(newUser);
        if (addedUser) {
            return await this.signIn(email, password);
        } else {
            throw new BadRequestException('user registration failed');
        }
    }
}