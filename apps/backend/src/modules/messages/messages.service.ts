import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Message } from './message.entity';
import { SenderType, ServiceStatus } from '../../common/enums';
import { REDIS_CLIENT } from '../../config/redis/redis.module';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  async getMessages(
    userId: string,
    businessId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { user_id: userId, business_id: businessId },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data: messages,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async sendMessage(userId: string, businessId: string, content: string) {
    const message = this.messageRepository.create({
      user_id: userId,
      business_id: businessId,
      sender_type: SenderType.CUSTOMER,
      content,
      is_automated: false,
      is_read: false,
    });

    const saved = await this.messageRepository.save(message);

    // Publish to Redis for real-time delivery
    await this.redisClient.publish(
      `messages:${userId}`,
      JSON.stringify({
        id: saved.id,
        content: saved.content,
        sender_type: saved.sender_type,
        is_automated: saved.is_automated,
        created_at: saved.created_at,
      }),
    );

    return saved;
  }

  async createAutomatedMessage(
    userId: string,
    businessId: string,
    content: string,
  ) {
    const message = this.messageRepository.create({
      user_id: userId,
      business_id: businessId,
      sender_type: SenderType.SYSTEM,
      content,
      is_automated: true,
      is_read: false,
    });

    const saved = await this.messageRepository.save(message);

    // Publish to Redis for real-time delivery
    await this.redisClient.publish(
      `messages:${userId}`,
      JSON.stringify({
        id: saved.id,
        content: saved.content,
        sender_type: saved.sender_type,
        is_automated: saved.is_automated,
        created_at: saved.created_at,
      }),
    );

    return saved;
  }

  /**
   * Generates a human-readable message for a status change.
   * Uses the configured terminology for the service provider.
   */
  generateStatusChangeMessage(
    status: ServiceStatus,
    terminology: string = 'provider',
  ): string {
    switch (status) {
      case ServiceStatus.PROVIDER_ASSIGNED:
        return `Your ${terminology} has been assigned and will be in touch soon.`;
      case ServiceStatus.ON_THE_WAY:
        return `Your ${terminology} is on the way.`;
      case ServiceStatus.ARRIVED:
        return `Your ${terminology} has arrived.`;
      case ServiceStatus.IN_PROGRESS:
        return `Your service is now in progress.`;
      case ServiceStatus.COMPLETED:
        return `Your service has been completed. Thank you!`;
      case ServiceStatus.CANCELLED:
        return `Your service has been cancelled.`;
      default:
        return `Your service status has been updated to: ${status}.`;
    }
  }
}
