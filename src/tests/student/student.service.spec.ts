import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { CreateStudentDto } from '../../student/dtos/createStudent.dto';
import { StudentDto } from '../../student/dtos/student.dto';
import { StudentService } from '../../student/services/student.service';

describe('StudentService', () => {
    let service: StudentService;
    let repository: Repository<Student>;

    const mockStudentRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        findOnyBy: jest.fn(),
        findAndCount: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
        createQueryBuilder: jest.fn(() => ({
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orWhere: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            take: jest.fn().mockReturnThis(),
            getManyAndCount: jest.fn(),
        })),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StudentService,
                {
                    provide: getRepositoryToken(Student),
                    useValue: mockStudentRepository,
                },
            ],
        }).compile();

        service = module.get<StudentService>(StudentService);
        repository = module.get<Repository<Student>>(getRepositoryToken(Student));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of students', async () => {
            const mockStudents: Student[] = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    birthDate: new Date('1990-01-01'),
                    gender: 'Male',
                    country: 'Kenya',
                },
            ];
            mockStudentRepository.find.mockResolvedValue(mockStudents);

            const result = await service.findAll();
            expect(result).toEqual(mockStudents.map(student => service.transformToStudentDto(student)));
        });
    });

    describe('findById', () => {
        it('should return a student by id', async () => {
            const id = 1;
            const mockStudent: Student = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                birthDate: new Date('1990-01-01'),
                gender: 'Male',
                country: 'Kenya',
            };

            // Mock findOne method with mockResolvedValue
            mockStudentRepository.findOne.mockResolvedValue(mockStudent);

            const result = await service.findById(id);
            expect(result).toEqual(service.transformToStudentDto(mockStudent));
        });

        it('should return undefined if student is not found', async () => {
            const id = 999; // Assuming there's no student with ID 999

            // Mock findOne method to return undefined
            mockStudentRepository.findOne.mockResolvedValue(undefined);

            const result = await service.findById(id);
            expect(result).toBeUndefined();
        });
    });


    describe('findByEmail', () => {
      it('should return a student by email', async () => {
        const email = 'john.doe@example.com';
        const mockStudent: Student = {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email,
          birthDate: new Date('1990-01-01'),
          gender: 'Male',
          country: 'South Africa',
        };
        mockStudentRepository.findOne.mockResolvedValue(mockStudent);

        const result = await service.findByEmail(email);
        expect(result).toEqual(service.transformToStudentDto(mockStudent));
      });

      it('should return undefined if student with email is not found', async () => {
        const email = 'nonexistent@example.com';
        mockStudentRepository.findOne.mockResolvedValue(undefined);

        const result = await service.findByEmail(email);
        expect(result).toBeUndefined();
      });
    });

    describe('findPaginated', () => {
        it('should return paginated data of students', async () => {
            const page = 1;
            const limit = 10;
            const mockStudents: Student[] = [
                {
                    id: 1,
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    birthDate: new Date('1990-01-01'),
                    gender: 'Male',
                    country: 'Sudan',
                },
            ];
            const mockTotal = 1;

            mockStudentRepository.findAndCount.mockResolvedValue([mockStudents, mockTotal]);

            const result = await service.findPaginated(page, limit);
            expect(result.data).toEqual(mockStudents.map(student => service.transformToStudentDto(student)));
            expect(result.total).toEqual(mockTotal);
        });
    });

    describe('add', () => {
        it('should add a new student', async () => {
          const newStudent: CreateStudentDto = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            birthDate: new Date('1995-01-01'),
            gender: 'Female',
            country: 'Brazil',
          };
    
          const mockCreatedStudent: Student = {
            id: 2,
            ...newStudent,
          };
    
          mockStudentRepository.findOne.mockResolvedValue(undefined);
          mockStudentRepository.save.mockResolvedValue(mockCreatedStudent);
    
          const result = await service.add(newStudent);
          expect(result).toEqual(service.transformToStudentDto(mockCreatedStudent));
        });
    
        it('should throw BadRequestException if student email already exists', async () => {
          const existingStudent: Student = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            birthDate: new Date('1990-01-01'),
            gender: 'Male',
            country: 'Mexico',
          };
    
          mockStudentRepository.findOne.mockResolvedValue(existingStudent);
    
          const newStudent: CreateStudentDto = {
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'john.doe@example.com', // Same email as existing student
            birthDate: new Date('1995-01-01'),
            gender: 'Female',
            country: 'Kenya',
          };
    
          await expect(service.add(newStudent)).rejects.toThrow(BadRequestException);
        });
      });

   
      describe('update', () => {
        it('should update an existing student', async () => {
            const mockExistingStudent: Student = {
                id: 2,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                birthDate: new Date('1995-01-01'),
                gender: 'Female',
                country: 'Somalia',
            };

            const updatedStudent: StudentDto = {
                id: 2,
                firstName: 'Updated',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                birthDate: new Date('1990-01-01'),
                gender: 'Male',
                country: 'Nigeria',
            };

            mockStudentRepository.findOne.mockResolvedValue(mockExistingStudent);
            mockStudentRepository.save.mockResolvedValue(updatedStudent as Student);

            const result = await service.update(updatedStudent);

            expect(result).toEqual(service.transformToStudentDto(updatedStudent));
        });

        it('should throw BadRequestException if student does not exist', async () => {
            const nonExistingStudentId = 999;
            mockStudentRepository.findOne.mockResolvedValue(undefined);

            const updatedStudent: StudentDto = {
                id: nonExistingStudentId,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane.doe@example.com',
                birthDate: new Date('1995-01-01'),
                gender: 'Female',
                country: 'Kenya',
            };

            await expect(service.update(updatedStudent)).rejects.toThrow(BadRequestException);
        });
    });


    describe('remove', () => {
      it('should remove an existing student', async () => {
        const idToRemove = 1;
        const existingStudent: Student = {
          id: idToRemove,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          birthDate: new Date('1990-01-01'),
          gender: 'Male',
          country: 'Kenya',
        };
        mockStudentRepository.findOne.mockResolvedValue(existingStudent);
        mockStudentRepository.remove.mockResolvedValue(existingStudent);

        const result = await service.remove(idToRemove);
        expect(result).toEqual(service.transformToStudentDto(existingStudent));
      });

      it('should return null if student to remove does not exist', async () => {
        const nonExistingStudentId = 999;
        mockStudentRepository.findOne.mockResolvedValue(undefined);

        const result = await service.remove(nonExistingStudentId);
        expect(result).toBeNull();
      });
    });
});
