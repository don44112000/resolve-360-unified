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
import { Customer } from '../Customers/customer.entity';
import { Brand } from '../Brands/brand.entity';
import { PostStatus, PostPriority } from '../../shared/enums/common.enum';

@Entity('posts')
@Index('idx_posts_brand_id', ['brandId'])
@Index('idx_posts_customer_id', ['customerId'])
@Index('idx_posts_status', ['status'])
export class Post {
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

  @Column({ name: 'customer_id', type: 'bigint', nullable: false })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'brand_id', type: 'bigint', nullable: false })
  brandId: string;

  @ManyToOne(() => Brand, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 50, default: 'open' })
  status: PostStatus;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'is_edited', type: 'boolean', default: false })
  isEdited: boolean;

  @Column({ type: 'varchar', length: 50, default: 'normal' })
  priority: PostPriority;

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
