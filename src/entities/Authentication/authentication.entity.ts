import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
} from 'typeorm';

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
