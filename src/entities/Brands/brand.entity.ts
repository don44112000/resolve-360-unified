import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';
import { BrandStatus } from '../../shared/enums/common.enum';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({
    name: 'ref_id',
    type: 'uuid',
    unique: true,
    nullable: false,
    generated: 'uuid',
  })
  refId: string;

  @Column({ name: 'legal_name', type: 'varchar', length: 255, nullable: true })
  legalName: string | null;

  @Column({ name: 'display_name', type: 'varchar', length: 255, nullable: true })
  displayName: string | null;

  @Column({ name: 'short_name', type: 'varchar', length: 100, nullable: true })
  shortName: string | null;

  @Column({ name: 'primary_domain', type: 'varchar', length: 255, nullable: true })
  primaryDomain: string | null;

  @Column({ name: 'primary_email', type: 'varchar', length: 255, nullable: true })
  primaryEmail: string | null;

  @Column({ name: 'primary_country_code', type: 'varchar', length: 10, nullable: true })
  primaryCountryCode: string | null;

  @Column({ name: 'primary_phone', type: 'varchar', length: 20, nullable: true })
  primaryPhone: string | null;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'contact_meta', type: 'jsonb', nullable: true })
  contactMeta: Record<string, any> | null;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  status: BrandStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
    default: () => 'NOW()',
  })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
