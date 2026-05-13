import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Business } from '../businesses/business.entity';
import { SenderType } from '../../common/enums';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ type: 'varchar' })
  sender_type: SenderType;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  is_automated: boolean;

  @Column({ default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.messages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.messages)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
