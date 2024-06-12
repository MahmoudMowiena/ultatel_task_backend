import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'int', nullable: true })
    age: number;

    @Column({ type: 'enum', enum: ['Male', 'Female'], default: 'Male' })
    gender: 'Male' | 'Female';

    @Column()
    country: string;
}