import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/student/entities/student.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'aws-0-eu-central-1.pooler.supabase.com',
            port: 6543,
            username: 'postgres.pqvvtmvqzwsewlhbgdzr',
            password: 'fugry0-tibbiW-zonves',
            database: 'postgres',
            entities: [User, Student],
            synchronize: true, // Note: Set to false in production
        }),
    ],
})
export class DatabaseModule { }
