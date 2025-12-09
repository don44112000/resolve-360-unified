import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Generated,
} from 'typeorm';

/**
 * User entity - Example entity demonstrating TypeORM patterns
 * Uses snake_case for database column names
 * UUID generation for unique identifiers
 */
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true, name: 'user_ref_id' })
    @Generated('uuid')
    userRefId: string;

    @Column({ nullable: true, name: 'email' })
    email: string;

    @Column({ nullable: true, name: 'first_name' })
    firstName: string;

    @Column({ nullable: true, name: 'last_name' })
    lastName: string;

    @Column({ nullable: true, name: 'phone_number' })
    phoneNumber: string;

    @Column({ default: true, name: 'is_active' })
    isActive: boolean;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({
        nullable: true,
        default: () => 'CURRENT_TIMESTAMP',
        name: 'updated_at',
    })
    updatedAt: Date;
}
