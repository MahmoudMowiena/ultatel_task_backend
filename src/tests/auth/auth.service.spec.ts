import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/services/user.service';

import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/common/dtos/registerUser.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
  genSalt: jest.fn(),
}));


describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });


  describe('signIn', () => {
    it('should return access token if credentials are valid', async () => {
      const user = { email: 'test@example.com', password: 'hashedpassword', firstName: 'Test', lastName: 'User' };
      const password = 'password';
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access_token');

      const result = await authService.signIn('test@example.com', password);
      expect(result).toEqual({ access_token: 'access_token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(authService.signIn('test@example.com', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const user = { email: 'test@example.com', password: 'hashedpassword', firstName: 'Test', lastName: 'User' };
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn('test@example.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
    });

  });


  describe('signUp', () => {
    it('should sign up a new user, then automatically sign in and return access token', async () => {
      const newUser: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockUserService.findByEmail.mockResolvedValueOnce(null);
      mockUserService.create.mockResolvedValue(newUser);
      
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('access_token');
  
      const result = await authService.signUp(newUser);
      expect(result).toEqual({ access_token: 'access_token' });
  
      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserService.create).toHaveBeenCalledWith(newUser);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      });
    });
  
    it('should throw BadRequestException if passwords do not match', async () => {
      const newUser: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'differentpassword',
        firstName: 'Test',
        lastName: 'User',
      };
  
      await expect(authService.signUp(newUser)).rejects.toThrow(BadRequestException);
    });
  
    it('should throw ConflictException if email already registered', async () => {
      const newUser: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
        firstName: 'Test',
        lastName: 'User',
      };
      
      mockUserService.findByEmail.mockResolvedValue(newUser);
  
      await expect(authService.signUp(newUser)).rejects.toThrow(ConflictException);
    });
  });
  

});

