import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { HandleErrors } from 'src/common/handleErros';
import * as bcrypt from 'bcrypt';
import { CreateRolDto } from './dto/create-rol.dto';
import { Rol } from './entities/rol.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload-interface';
import { isUUID } from 'class-validator';
import { LoginUserDto } from './dto/login-user.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,

    private readonly jwtService: JwtService

  ) { }

  async planeUserResponse(term: string) {
    const user = await this.findOne(term)

    return this.planeUser(user)
  }

  async planeUser(user: User,) {
    const { roles, ...values } = user;

    const currentRoles = roles.map((rol) => {
      return rol.rol
    })

    return {
      ...values,
      roles: currentRoles,
      token: this.getJwtToken({id: user.id})
    }
  }


  async findRoles(uuidRoles: string[]) {

    const currentRoles = uuidRoles.map((rol) => {
      return this.rolRepository.findOneBy({ id: rol })
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
        password: await bcrypt.hash(password, 10),
        ...values
      })

      await this.userRepository.save(user)
      const currentUser = await this.planeUser(user)
      return currentUser;
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

    const users = await this.userRepository.find()

    return users.map((user) => {
      const {roles, ...userData} = user

      const currentRoles = roles.map((rol) => {
        return rol.rol
      })

      return {
        ...userData,
        roles: currentRoles
      } 
    });

  }

  async findOne(term: string) {
    let user: User | User[] | null = null;

    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term })
    } else {
      user = await this.userRepository.findOne({
        where: [
          { fullName: ILike(`%${term.trim()}%`) },
          { email: term },
        ],
      })
    }

    if (!user) throw new NotFoundException('El usuario no fue encontrado')


    return user;
  }


  async findUsersBy(term: string){
    let users: User[] | null = null;

    users = await this.userRepository.find({
      where: [
        {fullName: ILike(`%${term.toLowerCase().trim()}%`)},
        {email: ILike(`%${term}%`)}
      ],
    })

    if(!users) throw new NotFoundException(`No se encontraron usuarios con ${term}`)

    return users
  }


  async checkAuthStatus(user: User) {
    const currentUser = await this.planeUser(user)
    return {
      ...currentUser,
      token: this.getJwtToken({ id: user.id })
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {
        email
      },
    })


    if (!user || !await bcrypt.compare(password, user.password))
      throw new UnauthorizedException('Las credenciales no son validas')


    const currentUser = await this.planeUser(user)

    return currentUser;

  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
