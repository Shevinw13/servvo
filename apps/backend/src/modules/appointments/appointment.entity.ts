import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Business } from '../businesses/business.entity';
import { Property } from '../properties/property.entity';
import { ServiceStatusEvent } from '../service-status/service-status-event.entity';
import { Review } from '../reviews/review.entity';
import { ServicePhoto } from '../media/service-photo.entity';
import { Invoice } from '../invoices/invoice.entity';
import { ServiceStatus } from '../../common/enums';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ type: 'uuid', nullable: true })
  property_id: string;

  @Column()
  service_type: string;

  @Column({ type: 'varchar', default: ServiceStatus.SCHEDULED })
  status: ServiceStatus;

  @Column({ type: 'timestamp' })
  scheduled_date: Date;

  @Column({ nullable: true })
  arrival_window_start: string;

  @Column({ nullable: true })
  arrival_window_end: string;

  @Column({ nullable: true })
  provider_name: string;

  @Column({ type: 'text', nullable: true })
  provider_notes: string;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.appointments)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Property, (property) => property.appointments)
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @OneToMany(() => ServiceStatusEvent, (event) => event.appointment)
  status_events: ServiceStatusEvent[];

  @OneToOne(() => Review, (review) => review.appointment)
  review: Review;

  @OneToMany(() => ServicePhoto, (photo) => photo.appointment)
  photos: ServicePhoto[];

  @OneToMany(() => Invoice, (invoice) => invoice.appointment)
  invoices: Invoice[];
}
