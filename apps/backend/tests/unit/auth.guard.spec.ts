import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '../../src/common/guards/auth.guard';
import { User } from '../../src/modules/users/user.entity';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let userRepository: any;

  const mockUser = {
    id: 'user-uuid-123',
    firebase_uid: 'firebase-uid-123',
    business_id: 'business-uuid-123',
  };

  function createMockContext(authHeader?: string): ExecutionContext {
    const request = {
      headers: {
        authorization: authHeader,
      },
    };
    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: { verify: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('test-secret') },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOne: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get(JwtService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should throw UnauthorizedException when no authorization header', async () => {
    const context = createMockContext(undefined);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when token format is invalid', async () => {
    const context = createMockContext('InvalidFormat token123');

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when JWT verification fails', async () => {
    const context = createMockContext('Bearer invalid-token');
    jwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when user not found', async () => {
    const context = createMockContext('Bearer valid-token');
    jwtService.verify.mockReturnValue({
      sub: 'nonexistent-user',
      firebaseUid: 'uid',
      businessId: 'bid',
    } as any);
    userRepository.findOne.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should attach user to request and return true for valid token', async () => {
    const context = createMockContext('Bearer valid-token');
    jwtService.verify.mockReturnValue({
      sub: 'user-uuid-123',
      firebaseUid: 'firebase-uid-123',
      businessId: 'business-uuid-123',
    } as any);
    userRepository.findOne.mockResolvedValue(mockUser);

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    const request = context.switchToHttp().getRequest() as any;
    expect(request.user).toEqual(mockUser);
  });

  it('should verify JWT with correct secret', async () => {
    const context = createMockContext('Bearer my-token');
    jwtService.verify.mockReturnValue({
      sub: 'user-uuid-123',
      firebaseUid: 'firebase-uid-123',
      businessId: 'business-uuid-123',
    } as any);
    userRepository.findOne.mockResolvedValue(mockUser);

    await guard.canActivate(context);

    expect(jwtService.verify).toHaveBeenCalledWith('my-token', {
      secret: 'test-secret',
    });
  });
});
