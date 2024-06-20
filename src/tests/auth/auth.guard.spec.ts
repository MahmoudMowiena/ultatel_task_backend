// import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let jwtService: JwtService;
    let configService: ConfigService;

    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
        jwtService = module.get<JwtService>(JwtService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    describe('canActivate', () => {
        it('should return true if the token is valid', async () => {
            const mockExecutionContext = createMockExecutionContext('Bearer valid_token');
            const mockPayload = { userId: 1 };

            mockConfigService.get.mockReturnValue('SECRET_KEY');
            mockJwtService.verifyAsync.mockResolvedValue(mockPayload);

            const result = await guard.canActivate(mockExecutionContext);
            expect(result).toBe(true);
            expect(mockExecutionContext.switchToHttp().getRequest().user).toEqual(mockPayload);
        });

        it('should throw UnauthorizedException if no token is provided', async () => {
            const mockExecutionContext = createMockExecutionContext('');

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if the token is invalid', async () => {
            const mockExecutionContext = createMockExecutionContext('Bearer invalid_token');

            mockConfigService.get.mockReturnValue('SECRET_KEY');
            mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

            await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(UnauthorizedException);
        });
    });

    function createMockExecutionContext(authorizationHeader: string): ExecutionContext {
        return {
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({
                    headers: {
                        authorization: authorizationHeader,
                    },
                }),
            }),
        } as unknown as ExecutionContext;
    }
});
