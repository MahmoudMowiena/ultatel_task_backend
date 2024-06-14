import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StudentService } from '../services/student.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateStudentDto } from '../dtos/createStudent.dto';
import { UpdateStudentDto } from '../dtos/updateStudent.dto';

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
    update(@Body() updatedStudent: UpdateStudentDto) {
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
    ) {
        const result = await this.studentService.findPaginated(page, limit);
        return {
            data: result.data,
            currentPage: page,
            totalPages: Math.ceil(result.total / limit),
            totalItems: result.total,
        };
    }
}
