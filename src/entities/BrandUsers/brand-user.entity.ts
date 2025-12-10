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
import { Brand } from '../Brands/brand.entity';
import { User } from '../Users/user.entity';
import { BrandUserRole } from '../../shared/enums/common.enum';

@Entity('brand_users')
@Index('idx_brand_user_unique', ['brandId', 'userId'], { unique: true })
export class BrandUser {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ name: 'brand_id', type: 'bigint', nullable: false })
  brandId: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ name: 'user_id', type: 'bigint', nullable: false })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 50, nullable: false })
  role: BrandUserRole;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any> | null;

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
