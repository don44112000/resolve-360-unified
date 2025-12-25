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
import { Authentication } from '../Authentication/authentication.entity';
import { UserRole } from '../../shared/enums/common.enum';

@Entity('users')
@Index('idx_users_email_unique', ['email'], {
  unique: true,
  where: 'email IS NOT NULL',
})
@Index('idx_users_phone_cc_unique', ['countryCode', 'phone'], {
  unique: true,
  where: 'phone IS NOT NULL AND country_code IS NOT NULL',
})
export class User {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'auth_id', type: 'bigint', nullable: true })
  authId: string | null;

  @ManyToOne(() => Authentication, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'auth_id' })
  authorization: Authentication | null;

  @Column({
    name: 'ref_id',
    type: 'uuid',
    unique: true,
    nullable: false,
    generated: 'uuid',
  })
  refId: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ name: 'country_code', type: 'varchar', length: 10, nullable: true })
  countryCode: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

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
