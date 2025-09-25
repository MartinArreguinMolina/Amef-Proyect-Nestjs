import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { HandleErrors } from 'src/common/handleErros';
import * as bcrypt from 'bcrypt';
import { CreateRolDto } from './dto/create-rol.dto';
import { Rol } from './entities/rol.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload-interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    private readonly jwtService: JwtService

  ) { }


  async planeUser(user: User){
    const {password ,roles,...values} = user;

    const currentRoles = roles.map((rol) => {
      return rol.rol
    })

    return {
      ...values,
      roles: currentRoles
    }

  }


  async findRoles(uuidRoles: string[]) {

    const currentRoles = uuidRoles.map((rol) => {
      return this.rolRepository.findOneBy({ id: rol})
    })

    const roles = await Promise.all(currentRoles);


    if (roles.some(rol => rol === null)) {
      throw new NotFoundException('Uno o más de los roles especificados no fueron encontrados');
    }


    return roles as Rol[];
  }

  async createUser(createUserDto: CreateUserDto) {


    try {
      const { password, roles, ...values } = createUserDto;

      const currentRoles = await this.findRoles(roles);

      const user = this.userRepository.create({
        roles: currentRoles,
        password: bcrypt.hashSync(password, 10),
        ...values
      })

      await this.userRepository.save(user)
      const currenUser = await this.planeUser(user);
      return {
        ...currenUser, 
        token: this.getJwtToken({id: user.id})
      }
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }


  async createRol(createRolDto: CreateRolDto) {
    try {
      const rol = this.rolRepository.create(createRolDto);
      await this.rolRepository.save(rol);

      return rol;
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findAll() {

    const users = await this.userRepository.find({
      relations: {
        roles: true
      }
    })

    const currentUsers = Promise.all(
      users.map((user) => this.planeUser(user))
    )

    return currentUsers;

  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload)
    return token
  }
}
