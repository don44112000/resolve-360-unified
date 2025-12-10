import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  BeforeUpdate,
} from 'typeorm';
import { Authorization } from '../Authorizations/authorization.entity';

@Entity('customers')
@Index('idx_customers_email_unique', ['email'], {
  unique: true,
  where: 'email IS NOT NULL',
})
@Index('idx_customers_phone_cc_unique', ['countryCode', 'phone'], {
  unique: true,
  where: 'phone IS NOT NULL AND country_code IS NOT NULL',
})
export class Customer {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'auth_id', type: 'bigint', nullable: true })
  authId: string | null;

  @ManyToOne(() => Authorization, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'auth_id' })
  authorization: Authorization | null;

  @Column({
    name: 'ref_id',
    type: 'uuid',
    unique: true,
    nullable: false,
    generated: 'uuid',
  })
  refId: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'country_code', type: 'varchar', length: 10, nullable: true })
  countryCode: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

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
