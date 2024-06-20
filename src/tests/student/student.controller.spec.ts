import { StudentController } from '../../student/controllers/student.controller';
import { StudentService } from '../../student/services/student.service';
import { CreateStudentDto } from '../../student/dtos/createStudent.dto';
import { StudentDto } from '../../student/dtos/student.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Test, TestingModule } from '@nestjs/testing';

describe('StudentController', () => {
    let controller: StudentController;
    let service: StudentService;

    const mockStudentService = {
        findAll: jest.fn(),
        add: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        findConditional: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [StudentController],
            providers: [
                { provide: StudentService, useValue: mockStudentService },
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();

        controller = module.get<StudentController>(StudentController);
        service = module.get<StudentService>(StudentService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('getAll', () => {
        it('should return an array of students', async () => {
            const mockStudents = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }];
            mockStudentService.findAll.mockResolvedValue(mockStudents);

            const result = await controller.getAll();
            expect(result).toEqual(mockStudents);
        });
    });

    describe('create', () => {
        it('should create a new student', async () => {
            const newStudent: CreateStudentDto = { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', birthDate: new Date('1995-01-01'), gender: 'Female', country: 'USA' };
            const mockCreatedStudent = { id: 1, ...newStudent };
            mockStudentService.add.mockResolvedValue(mockCreatedStudent);

            const result = await controller.create(newStudent);
            expect(result).toEqual(mockCreatedStudent);
        });
    });

    describe('update', () => {
        it('should update an existing student', async () => {
            const updatedStudent: StudentDto = { id: 1, firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', birthDate: new Date('1995-01-01'), gender: 'Female', country: 'USA' };
            mockStudentService.update.mockResolvedValue(updatedStudent);

            const result = await controller.update(updatedStudent);
            expect(result).toEqual(updatedStudent);
        });
    });

    describe('remove', () => {
        it('should remove a student by id', async () => {
            const studentId = 1;
            const mockRemovedStudent = { id: studentId, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
            mockStudentService.remove.mockResolvedValue(mockRemovedStudent);

            const result = await controller.remove(studentId);
            expect(result).toEqual(mockRemovedStudent);
        });
    });

    describe('paginate', () => {
        it('should return paginated data of students', async () => {
            const page = 1;
            const limit = 10;
            const mockStudents = [{ id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' }];
            const mockTotal = 1;

            mockStudentService.findConditional.mockResolvedValue({ data: mockStudents, total: mockTotal });

            const result = await controller.paginate(page, limit, 'John', 'USA', 'Male', '20', '30');
            expect(result).toEqual({
                data: mockStudents,
                currentPage: page,
                totalPages: Math.ceil(mockTotal / limit),
                totalItems: mockTotal,
            });
        });
    });

    describe('createMany', () => {
        it('should create multiple students', async () => {
            const newStudents: CreateStudentDto[] = [
                { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', birthDate: new Date('1995-01-01'), gender: 'Female', country: 'USA' },
                { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', birthDate: new Date('1990-01-01'), gender: 'Male', country: 'Canada' }
            ];
            mockStudentService.add.mockResolvedValueOnce({ id: 1, ...newStudents[0] });
            mockStudentService.add.mockResolvedValueOnce({ id: 2, ...newStudents[1] });

            const result = await controller.createMany(newStudents);
            expect(result).toEqual({ StudentsAdded: 2 });
        });
    });
});
