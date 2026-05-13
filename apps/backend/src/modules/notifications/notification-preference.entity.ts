import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ default: true })
  status_changes: boolean;

  @Column({ default: true })
  new_messages: boolean;

  @Column({ default: true })
  invoice_reminders: boolean;

  @Column({ default: true })
  review_requests: boolean;

  @Column({ default: true })
  appointment_confirmations: boolean;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.notification_preference)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
