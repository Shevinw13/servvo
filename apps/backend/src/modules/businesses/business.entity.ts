import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { BrandConfig } from './brand-config.entity';
import { User } from '../users/user.entity';
import { Appointment } from '../appointments/appointment.entity';
import { Message } from '../messages/message.entity';
import { Invoice } from '../invoices/invoice.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', nullable: true })
  crm_config: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => BrandConfig, (brandConfig) => brandConfig.business)
  brand_config: BrandConfig;

  @OneToMany(() => User, (user) => user.business)
  users: User[];

  @OneToMany(() => Appointment, (appointment) => appointment.business)
  appointments: Appointment[];

  @OneToMany(() => Message, (message) => message.business)
  messages: Message[];

  @OneToMany(() => Invoice, (invoice) => invoice.business)
  invoices: Invoice[];
}
