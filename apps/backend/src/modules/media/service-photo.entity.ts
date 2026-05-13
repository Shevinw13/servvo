import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity';

@Entity('service_photos')
export class ServicePhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  appointment_id: string;

  @Column()
  s3_key: string;

  @Column({ nullable: true })
  caption: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Appointment, (appointment) => appointment.photos)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;
}
