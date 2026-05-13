import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppointmentsService } from '../../src/modules/appointments/appointments.service';
import { Appointment } from '../../src/modules/appointments/appointment.entity';
import { ServiceStatus } from '../../src/common/enums';
import { RescheduleDto } from '../../src/modules/appointments/dto/reschedule.dto';
import { QueryAppointmentsDto } from '../../src/modules/appointments/dto/query-appointments.dto';

describe('AppointmentsService - Time-Based Partitioning', () => {
  const now = new Date('2024-06-15T12:00:00Z');

  function makeAppointment(
    overrides: Partial<Appointment>,
  ): Appointment {
    const appt = new Appointment();
    appt.id = 'appt-1';
    appt.user_id = 'user-1';
    appt.business_id = 'biz-1';
    appt.service_type = 'lawn_mowing';
    appt.status = ServiceStatus.SCHEDULED;
    appt.scheduled_date = new Date('2024-06-20T10:00:00Z');
    appt.created_at = new Date();
    appt.updated_at = new Date();
    Object.assign(appt, overrides);
    return appt;
  }

  describe('isUpcoming', () => {
    it('should return true for a future scheduled appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(true);
    });

    it('should return true for a future appointment with provider assigned', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.PROVIDER_ASSIGNED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(true);
    });

    it('should return false for a future cancelled appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.CANCELLED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(false);
    });

    it('should return false for a past appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-10T10:00:00Z'),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(false);
    });

    it('should return true for an appointment scheduled exactly at now', () => {
      const appt = makeAppointment({
        scheduled_date: new Date(now),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(true);
    });

    it('should return false for a past completed appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-10T10:00:00Z'),
        status: ServiceStatus.COMPLETED,
      });
      expect(AppointmentsService.isUpcoming(appt, now)).toBe(false);
    });
  });

  describe('isPast', () => {
    it('should return true for a past appointment regardless of status', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-10T10:00:00Z'),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(true);
    });

    it('should return true for a completed appointment even if future date', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.COMPLETED,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(true);
    });

    it('should return true for a cancelled appointment even if future date', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.CANCELLED,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(true);
    });

    it('should return false for a future scheduled appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(false);
    });

    it('should return false for a future in-progress appointment', () => {
      const appt = makeAppointment({
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.IN_PROGRESS,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(false);
    });

    it('should return false for an appointment scheduled exactly at now', () => {
      const appt = makeAppointment({
        scheduled_date: new Date(now),
        status: ServiceStatus.SCHEDULED,
      });
      expect(AppointmentsService.isPast(appt, now)).toBe(false);
    });
  });

  describe('partitioning completeness', () => {
    it('every appointment should be in at least one partition (upcoming or past)', () => {
      const statuses = Object.values(ServiceStatus);
      const dates = [
        new Date('2024-06-10T10:00:00Z'), // past
        new Date('2024-06-20T10:00:00Z'), // future
      ];

      for (const status of statuses) {
        for (const date of dates) {
          const appt = makeAppointment({ scheduled_date: date, status });
          const isUp = AppointmentsService.isUpcoming(appt, now);
          const isPst = AppointmentsService.isPast(appt, now);
          expect(isUp || isPst).toBe(true);
        }
      }
    });
  });
});

describe('AppointmentsService - Business Logic', () => {
  let service: AppointmentsService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    service = new AppointmentsService(mockRepository);
  });

  describe('findById', () => {
    it('should return appointment if owned by user', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.SCHEDULED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      const result = await service.findById('user-1', 'appt-1');
      expect(result).toEqual(appointment);
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findById('user-1', 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if appointment belongs to another user', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'other-user',
        status: ServiceStatus.SCHEDULED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      await expect(
        service.findById('user-1', 'appt-1'),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findNextUpcoming', () => {
    it('should return the next upcoming appointment', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        status: ServiceStatus.SCHEDULED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      const result = await service.findNextUpcoming('user-1');
      expect(result).toEqual(appointment);
    });

    it('should throw NotFoundException if no upcoming appointments', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findNextUpcoming('user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('cancel', () => {
    it('should cancel a scheduled appointment', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.SCHEDULED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);
      mockRepository.save.mockResolvedValue({
        ...appointment,
        status: ServiceStatus.CANCELLED,
      });

      const result = await service.cancel('user-1', 'appt-1');
      expect(result.status).toBe(ServiceStatus.CANCELLED);
    });

    it('should throw BadRequestException if already cancelled', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.CANCELLED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      await expect(
        service.cancel('user-1', 'appt-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if appointment is completed', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.COMPLETED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      await expect(
        service.cancel('user-1', 'appt-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('reschedule', () => {
    it('should reschedule a scheduled appointment', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.SCHEDULED,
        scheduled_date: new Date('2024-06-20T10:00:00Z'),
        arrival_window_start: '09:00',
        arrival_window_end: '11:00',
      };
      const dto: RescheduleDto = {
        date: '2024-06-25T10:00:00Z',
        arrivalWindowStart: '10:00',
        arrivalWindowEnd: '12:00',
      };
      mockRepository.findOne.mockResolvedValue(appointment);
      mockRepository.save.mockImplementation((appt: any) =>
        Promise.resolve(appt),
      );

      const result = await service.reschedule('user-1', 'appt-1', dto);
      expect(result.scheduled_date).toEqual(new Date('2024-06-25T10:00:00Z'));
      expect(result.arrival_window_start).toBe('10:00');
      expect(result.arrival_window_end).toBe('12:00');
    });

    it('should throw BadRequestException if appointment is cancelled', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.CANCELLED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      await expect(
        service.reschedule('user-1', 'appt-1', { date: '2024-06-25T10:00:00Z' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if appointment is completed', async () => {
      const appointment = {
        id: 'appt-1',
        user_id: 'user-1',
        status: ServiceStatus.COMPLETED,
      };
      mockRepository.findOne.mockResolvedValue(appointment);

      await expect(
        service.reschedule('user-1', 'appt-1', { date: '2024-06-25T10:00:00Z' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});

describe('RescheduleDto validation', () => {
  it('should pass with valid date', async () => {
    const dto = plainToInstance(RescheduleDto, {
      date: '2024-06-25T10:00:00Z',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with all fields', async () => {
    const dto = plainToInstance(RescheduleDto, {
      date: '2024-06-25T10:00:00Z',
      arrivalWindowStart: '10:00',
      arrivalWindowEnd: '12:00',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject missing date', async () => {
    const dto = plainToInstance(RescheduleDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.find((e) => e.property === 'date')).toBeDefined();
  });

  it('should reject empty date', async () => {
    const dto = plainToInstance(RescheduleDto, { date: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('QueryAppointmentsDto validation', () => {
  it('should pass with no params', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with valid filter', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, { filter: 'upcoming' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should pass with past filter', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, { filter: 'past' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject invalid filter value', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, { filter: 'invalid' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should pass with valid page and limit', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, {
      page: '2',
      limit: '10',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject non-numeric page', async () => {
    const dto = plainToInstance(QueryAppointmentsDto, { page: 'abc' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
