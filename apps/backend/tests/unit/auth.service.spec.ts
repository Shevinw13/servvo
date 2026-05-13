import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../src/modules/auth/auth.service';
import { FirebaseService } from '../../src/config/firebase/firebase.service';
import { User } from '../../src/modules/users/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let firebaseService: jest.Mocked<FirebaseService>;
  let jwtService: jest.Mocked<JwtService>;
  let userRepository: any;

  const mockUser: Partial<User> = {
    id: 'user-uuid-123',
    firebase_uid: 'firebase-uid-123',
    phone: '+15551234567',
    business_id: 'business-uuid-123',
    name: 'Test User',
    email: 'test@example.com',
    onboarding_complete: false,
    created_at: new Date(),
    last_login_at: undefined,
  };

  beforeEach(async () => {
    const mockFirebaseService = {
      verifyIdToken: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    firebaseService = module.get(FirebaseService);
    jwtService = module.get(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('verifyTokenAndLogin', () => {
    it('should verify token and return existing user with JWT', async () => {
      firebaseService.verifyIdToken.mockResolvedValue({
        uid: 'firebase-uid-123',
        phone_number: '+15551234567',
      } as any);

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue({
        ...mockUser,
        last_login_at: new Date(),
      });

      const result = await authService.verifyTokenAndLogin('valid-firebase-token');

      expect(firebaseService.verifyIdToken).toHaveBeenCalledWith('valid-firebase-token');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { firebase_uid: 'firebase-uid-123' },
      });
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.firebase_uid).toBe('firebase-uid-123');
    });

    it('should create a new user if not found', async () => {
      firebaseService.verifyIdToken.mockResolvedValue({
        uid: 'new-firebase-uid',
        phone_number: '+15559876543',
        business_id: 'business-uuid-456',
      } as any);

      userRepository.findOne.mockResolvedValue(null);
      const newUser = {
        id: 'new-user-uuid',
        firebase_uid: 'new-firebase-uid',
        phone: '+15559876543',
        business_id: 'business-uuid-456',
      };
      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);

      const result = await authService.verifyTokenAndLogin('new-user-token');

      expect(userRepository.create).toHaveBeenCalledWith({
        firebase_uid: 'new-firebase-uid',
        phone: '+15559876543',
        business_id: 'business-uuid-456',
      });
      expect(userRepository.save).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock-jwt-token');
      expect(result.user.firebase_uid).toBe('new-firebase-uid');
    });

    it('should throw UnauthorizedException for invalid Firebase token', async () => {
      firebaseService.verifyIdToken.mockRejectedValue(new Error('Invalid token'));

      await expect(
        authService.verifyTokenAndLogin('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should issue JWT with correct payload', async () => {
      firebaseService.verifyIdToken.mockResolvedValue({
        uid: 'firebase-uid-123',
        phone_number: '+15551234567',
      } as any);

      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(mockUser);

      await authService.verifyTokenAndLogin('valid-token');

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-uuid-123',
        firebaseUid: 'firebase-uid-123',
        businessId: 'business-uuid-123',
      });
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.getUserById('user-uuid-123');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-uuid-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await authService.getUserById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('validateJwtPayload', () => {
    it('should return user for valid payload', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await authService.validateJwtPayload({
        sub: 'user-uuid-123',
        firebaseUid: 'firebase-uid-123',
        businessId: 'business-uuid-123',
      });

      expect(result).toEqual(mockUser);
    });
  });
});
