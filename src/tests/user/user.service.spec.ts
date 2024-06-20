import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/common/dtos/registerUser.dto';

describe('UsersService', () => {
    let service: UserService;
    let repository: Repository<User>;

    const mockUserRepository = {
        findOne: jest.fn(),
        insert: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findByEmail', () => {
        it('should return a user by email', async () => {
            const email = 'test@example.com';
            const mockUser: User = {
                id: 1,
                email,
                password: 'password',
                firstName: 'Test',
                lastName: 'User',
            };

            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findByEmail(email);
            expect(result).toEqual(mockUser);
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const newUser: RegisterUserDto = {
                email: 'newuser@example.com',
                password: 'password',
                confirmPassword: 'password',
                firstName: 'New',
                lastName: 'User',
            };

            const mockCreatedUser = {
                id: 1,
                ...newUser,
            };

            mockUserRepository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });

            const result = await service.create(newUser);
            expect(result).toEqual({ identifiers: [{ id: 1 }] });
        });
    });
});
