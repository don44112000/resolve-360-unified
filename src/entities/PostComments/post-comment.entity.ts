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
import { Post } from '../Posts/post.entity';
import { Customer } from '../Customers/customer.entity';
import { User } from '../Users/user.entity';
import { CommentAuthorType } from '../../shared/enums/common.enum';

@Entity('post_comments')
@Index('idx_post_comments_post_id', ['postId'])
@Index('idx_post_comments_parent_comment_id', ['parentCommentId'])
@Index('idx_post_comments_customer_id', ['customerId'])
@Index('idx_post_comments_user_id', ['userId'])
export class PostComment {
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

  @Column({ name: 'post_id', type: 'bigint', nullable: false })
  postId: string;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Column({ name: 'parent_comment_id', type: 'bigint', nullable: true })
  parentCommentId: string | null;

  @ManyToOne(() => PostComment, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: PostComment | null;

  @Column({ name: 'author_type', type: 'varchar', length: 50, nullable: false })
  authorType: CommentAuthorType;

  @Column({ name: 'customer_id', type: 'bigint', nullable: true })
  customerId: string | null;

  @ManyToOne(() => Customer, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'is_edited', type: 'boolean', default: false })
  isEdited: boolean;

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
