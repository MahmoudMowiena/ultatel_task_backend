import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from '../../common/dtos/registerUser.dto';
import { SignInUserDto } from '../../common/dtos/signInUser.dto';
import { AuthController } from '../../auth/controllers/auth.controller';
import { AuthService } from '../../auth/services/auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signIn: jest.fn(),
        signUp: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('signIn', () => {
        it('should call authService.signIn and return the result', async () => {
            const signInUserDto: SignInUserDto = {
                email: 'test@example.com',
                password: 'password',
            };

            const mockResult = { accessToken: 'token' };
            mockAuthService.signIn.mockResolvedValue(mockResult);

            const result = await controller.signIn(signInUserDto);
            expect(result).toEqual(mockResult);
            expect(authService.signIn).toHaveBeenCalledWith(signInUserDto.email, signInUserDto.password);
        });
    });

    describe('signUp', () => {
        it('should call authService.signUp and return the result', async () => {
            const registerUserDto: RegisterUserDto = {
                email: 'newuser@example.com',
                password: 'password',
                confirmPassword: 'password',
                firstName: 'New',
                lastName: 'User',
            };

            const mockResult = { id: 1, ...registerUserDto };
            mockAuthService.signUp.mockResolvedValue(mockResult);

            const result = await controller.signUp(registerUserDto);
            expect(result).toEqual(mockResult);
            expect(authService.signUp).toHaveBeenCalledWith(registerUserDto);
        });
    });
});
