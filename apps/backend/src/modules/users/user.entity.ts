import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Business } from '../businesses/business.entity';
import { Property } from '../properties/property.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Message } from '../messages/message.entity';
import { Invoice } from '../invoices/invoice.entity';
import { PaymentMethod } from '../payments/payment-method.entity';
import { Review } from '../reviews/review.entity';
import { DeviceToken } from '../notifications/device-token.entity';
import { NotificationPreference } from '../notifications/notification-preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ unique: true })
  firebase_uid: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: false })
  onboarding_complete: boolean;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date;

  @ManyToOne(() => Business, (business) => business.users)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];

  @OneToMany(() => Appointment, (appointment) => appointment.user)
  appointments: Appointment[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => PaymentMethod, (paymentMethod) => paymentMethod.user)
  payment_methods: PaymentMethod[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => DeviceToken, (deviceToken) => deviceToken.user)
  device_tokens: DeviceToken[];

  @OneToOne(() => NotificationPreference, (pref) => pref.user)
  notification_preference: NotificationPreference;
}
