import { Injectable, Inject, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { Appointment } from '../appointments/appointment.entity';
import { ServiceStatusEvent } from './service-status-event.entity';
import { ServiceStatus } from '../../common/enums';
import { REDIS_CLIENT } from '../../config/redis/redis.module';
import { MessagesService } from '../messages/messages.service';

export interface StatusUpdatePayload {
  appointmentId: string;
  status: ServiceStatus;
  timestamp: string;
  arrivalWindow?: { start: string; end: string };
}

@Injectable()
export class ServiceStatusService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(ServiceStatusEvent)
    private readonly statusEventRepository: Repository<ServiceStatusEvent>,
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
    @Optional()
    private readonly messagesService?: MessagesService,
  ) {}

  async getStatus(appointmentId: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const history = await this.statusEventRepository.find({
      where: { appointment_id: appointmentId },
      order: { occurred_at: 'ASC' },
    });

    return {
      appointmentId: appointment.id,
      currentStatus: appointment.status,
      arrivalWindow:
        appointment.arrival_window_start && appointment.arrival_window_end
          ? {
              start: appointment.arrival_window_start,
              end: appointment.arrival_window_end,
            }
          : undefined,
      history: history.map((event) => ({
        id: event.id,
        status: event.status,
        occurredAt: event.occurred_at,
        metadata: event.metadata,
      })),
    };
  }

  async updateStatus(
    appointmentId: string,
    newStatus: ServiceStatus,
  ): Promise<StatusUpdatePayload> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // Save status event
    const statusEvent = this.statusEventRepository.create({
      appointment_id: appointmentId,
      status: newStatus,
      occurred_at: new Date(),
      metadata: { previousStatus: appointment.status },
    });
    await this.statusEventRepository.save(statusEvent);

    // Update appointment status
    appointment.status = newStatus;
    await this.appointmentRepository.save(appointment);

    // Build payload
    const payload: StatusUpdatePayload = {
      appointmentId,
      status: newStatus,
      timestamp: statusEvent.occurred_at.toISOString(),
    };

    if (
      newStatus === ServiceStatus.ON_THE_WAY &&
      appointment.arrival_window_start &&
      appointment.arrival_window_end
    ) {
      payload.arrivalWindow = {
        start: appointment.arrival_window_start,
        end: appointment.arrival_window_end,
      };
    }

    // Publish to Redis
    await this.redisClient.publish(
      `status:${appointmentId}`,
      JSON.stringify(payload),
    );

    // Generate automated message for the status change
    if (this.messagesService) {
      const message = this.messagesService.generateStatusChangeMessage(newStatus);
      await this.messagesService.createAutomatedMessage(
        appointment.user_id,
        appointment.business_id,
        message,
      );
    }

    return payload;
  }

  /**
   * Maps SMS reply body to a ServiceStatus.
   * "1" → on_the_way, "2" → arrived, "3" → completed
   * Returns undefined for unrecognized input.
   */
  static parseSmsStatus(body: string): ServiceStatus | undefined {
    const trimmed = body.trim();
    switch (trimmed) {
      case '1':
        return ServiceStatus.ON_THE_WAY;
      case '2':
        return ServiceStatus.ARRIVED;
      case '3':
        return ServiceStatus.COMPLETED;
      default:
        return undefined;
    }
  }
}
