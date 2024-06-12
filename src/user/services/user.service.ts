import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/auth/dtos/registerUser.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

    // private users = [
    //     {
    //         userId: 1,
    //         email: 'mowiena8@gmail.com',
    //         password: 'Password123!',
    //     },
    //     {
    //         userId: 2,
    //         email: 'nada@gmail.com',
    //         password: 'Password456!',
    //     },
    // ];

    async findOne(email: string): Promise<User | undefined> {
        // return this.users.find(user => user.email === email);
        return this.userRepository.findOneBy({ email });
    }

    async create(newUser: RegisterUserDto) {
        const user = {
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        }
        return this.userRepository.insert(user);
    }
}