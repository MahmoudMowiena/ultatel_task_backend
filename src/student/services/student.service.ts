import { BadRequestException, Injectable } from '@nestjs/common';
import { Student } from '../entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from '../dtos/createStudent.dto';
import { StudentDto } from '../dtos/student.dto';

@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }

    async findAll(): Promise<Student[]> {
        const students = await this.studentRepository.find();
        let returnedStudents: StudentDto[] = [];
        students.forEach(student => returnedStudents.push(this.transformToStudentDto(student)))
        return returnedStudents;
    }

    async findById(id: number): Promise<Student | undefined> {
        // return await this.studentRepository.findOneBy({ id });
        return await this.studentRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<Student | undefined> {
        // return await this.studentRepository.findOneBy({ email });
        return await this.studentRepository.findOne({ where: { email } });
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

        const createdStudent = await this.studentRepository.save(newStudent);
        return this.transformToStudentDto(createdStudent);
    }

    async update(updatedStudent: StudentDto) {
        const existingStudent = await this.findById(updatedStudent.id);
        if (!existingStudent) throw new BadRequestException("student does not exist");

        const updated = await this.studentRepository.save(updatedStudent);
        return this.transformToStudentDto(updated);
    }

    async remove(id: number): Promise<Student | null> {
        const studentToDelete = await this.findById(id);
        if (!studentToDelete) return null;

        const deletedStudent = await this.studentRepository.remove(studentToDelete);
        return this.transformToStudentDto(deletedStudent);
    }

    transformToStudentDto(student: Student): StudentDto {
        const studentDto = new StudentDto();
        studentDto.id = student.id;
        studentDto.firstName = student.firstName;
        studentDto.lastName = student.lastName;
        studentDto.email = student.email;
        studentDto.birthDate = student.birthDate;
        studentDto.gender = student.gender;
        studentDto.country = student.country;

        return studentDto;
    }

    async findConditional(
        page: number,
        limit: number,
        name?: string,
        country?: string,
        gender?: string,
        ageFrom?: string,
        ageTo?: string
    ): Promise<{ data: Student[], total: number }> {
        const query = this.studentRepository.createQueryBuilder('student');

        if (name) {
            query.orWhere('LOWER(student.firstName) LIKE LOWER(:name)', { name: `${name}%` });
            query.orWhere('LOWER(student.lastName) LIKE LOWER(:name)', { name: `${name}%` });
            query.orWhere("LOWER(CONCAT(student.firstName, ' ', student.lastName)) LIKE LOWER(:name)", { name: `${name}%` });
        }

        if (country) {
            query.andWhere('LOWER(student.country) LIKE LOWER(:country)', { country: `${country}%` });
        }

        if (gender) {
            query.andWhere('student.gender = :gender', { gender });
        }

        if (ageFrom) {
            query.andWhere('DATE_PART(\'year\', AGE(:today, student.birthDate)) >= :ageFrom', { today: new Date(), ageFrom });
        }

        if (ageTo) {
            query.andWhere('DATE_PART(\'year\', AGE(:today, student.birthDate)) <= :ageTo', { today: new Date(), ageTo });
        }

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return { data, total };
    }
}
