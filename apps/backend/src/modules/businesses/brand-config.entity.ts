import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from './business.entity';

@Entity('brand_configs')
export class BrandConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  business_id: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  primary_color: string;

  @Column({ nullable: true })
  accent_color: string;

  @Column({ nullable: true })
  service_provider_term: string;

  @Column({ type: 'jsonb', nullable: true })
  imagery: Record<string, any>;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Business, (business) => business.brand_config)
  @JoinColumn({ name: 'business_id' })
  business: Business;
}
