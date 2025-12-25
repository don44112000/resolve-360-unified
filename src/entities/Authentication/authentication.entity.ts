import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  OneToOne,
} from 'typeorm';
import { Customer } from '../Customers/customer.entity';
import { User } from '../Users/user.entity';

@Entity('authentication')
export class Authentication {
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

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  otp: string | null;

  @Column({
    name: 'refresh_token_hash',
    type: 'text',
    nullable: true,
  })
  refreshTokenHash: string | null;

  @Column({
    name: 'refresh_token_expires_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  refreshTokenExpiresAt: Date | null;

  @Column({
    name: 'refresh_token_revoked',
    type: 'boolean',
    default: false,
  })
  refreshTokenRevoked: boolean;

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

  // Relationships
  @OneToOne(() => Customer, (customer) => customer.authorization)
  customer: Customer;

  @OneToOne(() => User, (user) => user.authorization)
  user: User;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
