import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';
import { ServiceStatus } from '../../common/enums';

@Entity('service_status_events')
export class ServiceStatusEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column({ type: 'varchar' })
  status: ServiceStatus;

  @Column({ type: 'timestamp' })
  occurred_at: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => Appointment, (appointment) => appointment.status_events)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
