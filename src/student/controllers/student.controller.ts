import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CreateStudentDto } from '../dtos/createStudent.dto';
import { StudentDto } from '../dtos/student.dto';

@UseGuards(AuthGuard)
@Controller('students')
export class StudentController {
    constructor(private studentService: StudentService) { }

    @Get()
    getAll() {
        return this.studentService.findAll();
    }

    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Body() newStudent: CreateStudentDto) {
        return this.studentService.add(newStudent);
    }

    @HttpCode(HttpStatus.OK)
    @Put()
    update(@Body() updatedStudent: StudentDto) {
        return this.studentService.update(updatedStudent);
    }

    @HttpCode(HttpStatus.OK)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.studentService.remove(id);
    }

    @Get('search')
    async paginate(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('name') name: string,
        @Query('country') country: string,
        @Query('gender') gender: string,
        @Query('agefrom') ageFrom: string,
        @Query('ageto') ageTo: string,
    ) {
        const result = await this.studentService.findConditional(page, limit, name, country, gender, ageFrom, ageTo);
        return {
            data: result.data,
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('many')
    createMany(@Body() newStudents: CreateStudentDto[]) {
        let numberAdded = 0;
        newStudents.forEach(student => {
            this.studentService.add(student);
            ++numberAdded;
        })
        return { StudentsAdded: numberAdded };
    }
}
