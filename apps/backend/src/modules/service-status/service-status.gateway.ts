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
  namespace: '/status',
  cors: { origin: '*' },
})
export class ServiceStatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ServiceStatusGateway.name);

  constructor(
    @Inject(REDIS_SUBSCRIBER)
    private readonly redisSubscriber: Redis,
  ) {}

  afterInit() {
    this.logger.log('Service Status WebSocket Gateway initialized');

    // Subscribe to all status channels using pattern subscription
    this.redisSubscriber.psubscribe('status:*', (err) => {
      if (err) {
        this.logger.error('Failed to subscribe to status channels', err);
      } else {
        this.logger.log('Subscribed to status:* Redis channels');
      }
    });

    // Listen for messages on subscribed channels
    this.redisSubscriber.on('pmessage', (_pattern, channel, message) => {
      // channel format: "status:{appointmentId}"
      const appointmentId = channel.replace('status:', '');
      const payload = JSON.parse(message);

      // Emit to the room for this appointment
      this.server.to(`appointment:${appointmentId}`).emit('status:update', payload);
    });
  }

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe:appointment')
  handleSubscribe(
    @MessageBody() data: { appointmentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `appointment:${data.appointmentId}`;
    client.join(room);
    this.logger.debug(
      `Client ${client.id} joined room ${room}`,
    );
    return { event: 'subscribed', data: { appointmentId: data.appointmentId } };
  }

  @SubscribeMessage('unsubscribe:appointment')
  handleUnsubscribe(
    @MessageBody() data: { appointmentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `appointment:${data.appointmentId}`;
    client.leave(room);
    this.logger.debug(
      `Client ${client.id} left room ${room}`,
    );
    return { event: 'unsubscribed', data: { appointmentId: data.appointmentId } };
  }
}
