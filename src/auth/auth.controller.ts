import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateRolDto } from './dto/create-rol.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto : LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Post('rol')
  createRol(@Body() createRolDto: CreateRolDto){
    return this.authService.createRol(createRolDto)
  }

  @Get('department/:department/user/:user')
  async findUserByDepartment(@Param('department') department: string, @Param('user') user: string){
    return this.authService.findUsersByDepartment(department, user);
  }
  
  @Get('check-auth')
  @Auth()
  checkAuthStatus(@GetUser() user: User){
    return this.authService.checkAuthStatus(user)
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }


  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.authService.planeUserResponse(term);
  }

  @Get('users/:term')
  findUsersBy(@Param('term') term: string){
    return this.authService.findUsersBy(term)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}