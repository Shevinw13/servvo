import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessagesService } from './messages.service';
import { Message } from './message.entity';
import { ServiceStatus, SenderType } from '../../common/enums';
import { REDIS_CLIENT } from '../../config/redis/redis.module';

describe('MessagesService', () => {
  let service: MessagesService;
  let mockRepository: any;
  let mockRedisClient: any;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn((data) => ({ id: 'msg-1', created_at: new Date(), ...data })),
      save: jest.fn((entity) => Promise.resolve(entity)),
      findAndCount: jest.fn(),
    };

    mockRedisClient = {
      publish: jest.fn().mockResolvedValue(1),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockRepository,
        },
        {
          provide: REDIS_CLIENT,
          useValue: mockRedisClient,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  describe('generateStatusChangeMessage', () => {
    it('should generate message for ON_THE_WAY status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.ON_THE_WAY);
      expect(message).toBe('Your provider is on the way.');
    });

    it('should generate message for ARRIVED status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.ARRIVED);
      expect(message).toBe('Your provider has arrived.');
    });

    it('should generate message for IN_PROGRESS status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.IN_PROGRESS);
      expect(message).toBe('Your service is now in progress.');
    });

    it('should generate message for COMPLETED status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.COMPLETED);
      expect(message).toBe('Your service has been completed. Thank you!');
    });

    it('should generate message for CANCELLED status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.CANCELLED);
      expect(message).toBe('Your service has been cancelled.');
    });

    it('should generate message for PROVIDER_ASSIGNED status', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.PROVIDER_ASSIGNED);
      expect(message).toBe('Your provider has been assigned and will be in touch soon.');
    });

    it('should use custom terminology', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.ON_THE_WAY, 'crew');
      expect(message).toBe('Your crew is on the way.');
    });

    it('should use custom terminology for ARRIVED', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.ARRIVED, 'team');
      expect(message).toBe('Your team has arrived.');
    });

    it('should handle SCHEDULED status with default message', () => {
      const message = service.generateStatusChangeMessage(ServiceStatus.SCHEDULED);
      expect(message).toBe('Your service status has been updated to: scheduled.');
    });
  });

  describe('sendMessage', () => {
    it('should create a message with sender_type customer', async () => {
      const userId = 'user-1';
      const businessId = 'biz-1';
      const content = 'Hello!';

      await service.sendMessage(userId, businessId, content);

      expect(mockRepository.create).toHaveBeenCalledWith({
        user_id: userId,
        business_id: businessId,
        sender_type: SenderType.CUSTOMER,
        content,
        is_automated: false,
        is_read: false,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        `messages:${userId}`,
        expect.any(String),
      );
    });
  });

  describe('createAutomatedMessage', () => {
    it('should create a message with sender_type system and is_automated true', async () => {
      const userId = 'user-1';
      const businessId = 'biz-1';
      const content = 'Your provider is on the way.';

      await service.createAutomatedMessage(userId, businessId, content);

      expect(mockRepository.create).toHaveBeenCalledWith({
        user_id: userId,
        business_id: businessId,
        sender_type: SenderType.SYSTEM,
        content,
        is_automated: true,
        is_read: false,
      });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(mockRedisClient.publish).toHaveBeenCalledWith(
        `messages:${userId}`,
        expect.any(String),
      );
    });
  });

  describe('getMessages', () => {
    it('should return paginated messages ordered by created_at DESC', async () => {
      const messages = [
        { id: 'msg-1', content: 'Hello', created_at: new Date() },
        { id: 'msg-2', content: 'World', created_at: new Date() },
      ];
      mockRepository.findAndCount.mockResolvedValue([messages, 2]);

      const result = await service.getMessages('user-1', 'biz-1', 1, 20);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: { user_id: 'user-1', business_id: 'biz-1' },
        order: { created_at: 'DESC' },
        skip: 0,
        take: 20,
      });
      expect(result.data).toEqual(messages);
      expect(result.meta).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        totalPages: 1,
      });
    });

    it('should calculate correct skip for page 2', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      await service.getMessages('user-1', 'biz-1', 2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });
});
