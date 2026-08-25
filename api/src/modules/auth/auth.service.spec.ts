import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { USER_REPOSITORY } from '../users/user.repository.interface';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: any;
  let mockJwtService: any;
  let mockConfigService: any;

  const mockUser = {
    _id: { toString: () => 'user-id-123' },
    name: 'Test User',
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    refreshTokenHash: '$2b$10$hashedrefreshtoken',
  };

  beforeEach(async () => {
    mockUserRepo = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findByEmailWithPasswordHash: jest.fn(),
      findById: jest.fn(),
      findByIdWithRefreshTokenHash: jest.fn(),
      updateRefreshTokenHash: jest.fn(),
    };

    mockJwtService = {
      signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        switch (key) {
          case 'jwt.accessSecret':
            return 'access-secret';
          case 'jwt.accessExpiresIn':
            return '15m';
          case 'jwt.refreshSecret':
            return 'refresh-secret';
          case 'jwt.refreshExpiresIn':
            return '7d';
          default:
            return null;
        }
      }),
    };

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-string');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: USER_REPOSITORY, useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should throw ConflictException if user already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.signup({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should hash password and create user successfully', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);
      mockUserRepo.create.mockResolvedValue(mockUser);

      const result = await service.signup({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(mockUserRepo.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: 'hashed-string',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('signin', () => {
    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserRepo.findByEmailWithPasswordHash.mockResolvedValue(null);

      await expect(
        service.signin({ email: 'wrong@example.com', password: 'Password123!' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      mockUserRepo.findByEmailWithPasswordHash.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.signin({ email: 'test@example.com', password: 'WrongPassword' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return tokens on valid credentials', async () => {
      mockUserRepo.findByEmailWithPasswordHash.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.signin({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout', () => {
    it('should revoke refresh token hash by updating it to null', async () => {
      await service.logout('user-id-123');
      expect(mockUserRepo.updateRefreshTokenHash).toHaveBeenCalledWith(
        'user-id-123',
        null,
      );
    });
  });
});
