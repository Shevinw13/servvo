import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Invoice } from '../invoices/invoice.entity';
import { User } from '../users/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoice_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ nullable: true })
  stripe_payment_intent_id: string;

  @Column({ type: 'int' })
  amount_cents: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  payment_method_type: string;

  @Column({ nullable: true })
  payment_method_last4: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'invoice_id' })
  invoice: Invoice;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
