import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  stripe_payment_method_id: string;

  @Column()
  type: string;

  @Column()
  last4: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ type: 'int' })
  exp_month: number;

  @Column({ type: 'int' })
  exp_year: number;

  @Column({ default: false })
  is_default: boolean;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.payment_methods)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
