import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Not } from 'typeorm';
import { Appointment } from './appointment.entity';
import { ServiceStatus } from '../../common/enums';
import { RescheduleDto } from './dto/reschedule.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async findAll(
    userId: string,
    filter?: 'upcoming' | 'past',
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<Appointment>> {
    const now = new Date();
    const skip = (page - 1) * limit;

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.user_id = :userId', { userId });

    if (filter === 'upcoming') {
      queryBuilder.andWhere(
        '(appointment.scheduled_date >= :now AND appointment.status != :cancelled)',
        { now, cancelled: ServiceStatus.CANCELLED },
      );
      queryBuilder.orderBy('appointment.scheduled_date', 'ASC');
    } else if (filter === 'past') {
      queryBuilder.andWhere(
        '(appointment.scheduled_date < :now OR appointment.status IN (:...pastStatuses))',
        {
          now,
          pastStatuses: [ServiceStatus.COMPLETED, ServiceStatus.CANCELLED],
        },
      );
      queryBuilder.orderBy('appointment.scheduled_date', 'DESC');
    } else {
      queryBuilder.orderBy('appointment.scheduled_date', 'DESC');
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNextUpcoming(userId: string): Promise<Appointment> {
    const now = new Date();

    const appointment = await this.appointmentRepository.findOne({
      where: {
        user_id: userId,
        scheduled_date: MoreThanOrEqual(now),
        status: Not(ServiceStatus.CANCELLED),
      },
      order: { scheduled_date: 'ASC' },
    });

    if (!appointment) {
      throw new NotFoundException('No upcoming appointments found');
    }

    return appointment;
  }

  async findById(userId: string, appointmentId: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    if (appointment.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this appointment',
      );
    }

    return appointment;
  }

  async reschedule(
    userId: string,
    appointmentId: string,
    dto: RescheduleDto,
  ): Promise<Appointment> {
    const appointment = await this.findById(userId, appointmentId);

    if (
      appointment.status === ServiceStatus.CANCELLED ||
      appointment.status === ServiceStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cannot reschedule a cancelled or completed appointment',
      );
    }

    appointment.scheduled_date = new Date(dto.date);
    if (dto.arrivalWindowStart !== undefined) {
      appointment.arrival_window_start = dto.arrivalWindowStart;
    }
    if (dto.arrivalWindowEnd !== undefined) {
      appointment.arrival_window_end = dto.arrivalWindowEnd;
    }

    return this.appointmentRepository.save(appointment);
  }

  async cancel(userId: string, appointmentId: string): Promise<Appointment> {
    const appointment = await this.findById(userId, appointmentId);

    if (appointment.status === ServiceStatus.CANCELLED) {
      throw new BadRequestException('Appointment is already cancelled');
    }

    if (appointment.status === ServiceStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed appointment');
    }

    appointment.status = ServiceStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }

  /**
   * Determines if an appointment is "upcoming" based on time-based partitioning logic.
   * Upcoming: scheduled_date >= now AND status != cancelled
   */
  static isUpcoming(appointment: Appointment, now: Date = new Date()): boolean {
    return (
      appointment.scheduled_date >= now &&
      appointment.status !== ServiceStatus.CANCELLED
    );
  }

  /**
   * Determines if an appointment is "past" based on time-based partitioning logic.
   * Past: scheduled_date < now OR status == completed/cancelled
   */
  static isPast(appointment: Appointment, now: Date = new Date()): boolean {
    return (
      appointment.scheduled_date < now ||
      appointment.status === ServiceStatus.COMPLETED ||
      appointment.status === ServiceStatus.CANCELLED
    );
  }
}
