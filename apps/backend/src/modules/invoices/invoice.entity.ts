import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Business } from '../businesses/business.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Payment } from '../payments/payment.entity';
import { InvoiceStatus } from '../../common/enums';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ type: 'uuid', nullable: true })
  appointment_id: string;

  @Column({ type: 'varchar', default: InvoiceStatus.UNPAID })
  status: InvoiceStatus;

  @Column({ type: 'int' })
  amount_cents: number;

  @Column({ default: 'usd' })
  currency: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  due_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.invoices)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Business, (business) => business.invoices)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Appointment, (appointment) => appointment.invoices)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => Payment, (payment) => payment.invoice)
  payments: Payment[];
}
