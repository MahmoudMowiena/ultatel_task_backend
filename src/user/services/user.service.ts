import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/common/dtos/registerUser.dto';
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

    async findByEmail(email: string): Promise<User | undefined> {
        return await this.userRepository.findOneBy({ email });
    }

    async create(newUser: RegisterUserDto) {
        const user = {
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName
        }
        return await this.userRepository.insert(user);
    }
}