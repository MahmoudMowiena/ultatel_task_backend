import { BadRequestException, Injectable } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dtos/createStudent.dto';
import { UpdateStudentDto } from '../dtos/updateStudent.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }

    async findAll(): Promise<Student[]> {
        return await this.studentRepository.find();
    }

    async findById(id: number): Promise<Student | undefined> {
        return await this.studentRepository.findOneBy({ id });
    }

    async findByEmail(email: string): Promise<Student | undefined> {
        return await this.studentRepository.findOneBy({ email });
    }

    async findPaginated(page: number, limit: number): Promise<{ data: Student[], total: number }> {
        const [data, total] = await this.studentRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total };
    }

    async add(newStudent: CreateStudentDto) {
        const existingStudent = await this.findByEmail(newStudent.email);
        if (existingStudent) throw new BadRequestException("student already exists");

        return await this.studentRepository.insert(newStudent);
    }

    async update(updatedStudent: UpdateStudentDto) {
        const existingStudent = await this.findById(updatedStudent.id);
        if (!existingStudent) throw new BadRequestException("student does not exist");

        return await this.studentRepository.update(existingStudent.id, updatedStudent);
    }

    async remove(id: number): Promise<Student | null> {
        const studentToDelete = await this.findById(id);
        if (!studentToDelete) return null;

        return await this.studentRepository.remove(studentToDelete);
    }

    // private async isExisting(email: string): Promise<boolean> {
    //     const student = await this.studentRepository.findOneBy({ email });

    //     if (student) return true;
    //     return false;
    // }
}
