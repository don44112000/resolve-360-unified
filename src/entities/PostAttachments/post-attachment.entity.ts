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
  Check,
} from 'typeorm';
import { Post } from '../Posts/post.entity';
import { PostComment } from '../PostComments/post-comment.entity';
import { AttachmentFileType } from '../../shared/enums/common.enum';

@Entity('post_attachments')
@Check(
  `(post_id IS NOT NULL AND comment_id IS NULL) OR (post_id IS NULL AND comment_id IS NOT NULL)`,
)
@Index('idx_post_attachments_post_id', ['postId'], {
  where: 'post_id IS NOT NULL',
})
@Index('idx_post_attachments_comment_id', ['commentId'], {
  where: 'comment_id IS NOT NULL',
})
@Index('idx_post_attachments_public', ['isPublic'])
export class PostAttachment {
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

  @Column({ name: 'post_id', type: 'bigint', nullable: true })
  postId: string | null;

  @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'post_id' })
  post: Post | null;

  @Column({ name: 'comment_id', type: 'bigint', nullable: true })
  commentId: string | null;

  @ManyToOne(() => PostComment, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'comment_id' })
  comment: PostComment | null;

  @Column({ name: 'file_url', type: 'text', nullable: false })
  fileUrl: string;

  @Column({ name: 'file_name', type: 'varchar', length: 255, nullable: false })
  fileName: string;

  @Column({ name: 'file_type', type: 'varchar', length: 50, nullable: false })
  fileType: AttachmentFileType;

  @Column({ name: 'is_public', type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

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
