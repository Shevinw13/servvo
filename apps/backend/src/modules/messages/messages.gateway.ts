import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { REDIS_SUBSCRIBER } from '../../config/redis/redis.module';

@WebSocketGateway({
  namespace: '/messages',
  cors: { origin: '*' },
})
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);

  constructor(
    @Inject(REDIS_SUBSCRIBER)
    private readonly redisSubscriber: Redis,
  ) {}

  afterInit() {
    this.logger.log('Messages WebSocket Gateway initialized');

    // Subscribe to all message channels using pattern subscription
    this.redisSubscriber.psubscribe('messages:*', (err) => {
      if (err) {
        this.logger.error('Failed to subscribe to messages channels', err);
      } else {
        this.logger.log('Subscribed to messages:* Redis channels');
      }
    });

    // Listen for messages on subscribed channels
    this.redisSubscriber.on('pmessage', (_pattern, channel, message) => {
      // channel format: "messages:{userId}"
      const userId = channel.replace('messages:', '');
      const payload = JSON.parse(message);

      // Emit to the room for this user's messages
      this.server.to(`messages:${userId}`).emit('message:new', payload);
    });
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:messages')
  handleSubscribe(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `messages:${data.userId}`;
    client.join(room);
    this.logger.debug(`Client ${client.id} joined room ${room}`);
    return { event: 'subscribed', data: { userId: data.userId } };
  }

  @SubscribeMessage('unsubscribe:messages')
  handleUnsubscribe(
    @MessageBody() data: { userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `messages:${data.userId}`;
    client.leave(room);
    this.logger.debug(`Client ${client.id} left room ${room}`);
    return { event: 'unsubscribed', data: { userId: data.userId } };
  }
}
