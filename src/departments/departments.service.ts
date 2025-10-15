import { ILike, Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleErrors } from 'src/common/handleErros';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departamentRepositoty: Repository<Department>
  ) { }

  async create(createDepartmentDto: CreateDepartmentDto) {

    try {
      const departament = this.departamentRepositoty.create(createDepartmentDto);
      await this.departamentRepositoty.save(departament);

      return departament;
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }


  async findAll(){
    return this.departamentRepositoty.find()
  }



  async findAllByTerm(term: string) {
    let departments: Department[] | null = null;

    departments = await this.departamentRepositoty.find({
      where: [
        { department: ILike(`%${term}%`) }
      ]
    })

    if (!departments) throw new NotFoundException('Los departamentos no fueron encontrados')

    return departments
  }

  findOne(id: number) {
    return `This action returns a #${id} department`;
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  remove(id: number) {
    return `This action removes a #${id} department`;
  }
}
