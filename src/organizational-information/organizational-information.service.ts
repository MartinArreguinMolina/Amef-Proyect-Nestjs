import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganizationalInformationDto } from './dto/create-organizational-information.dto';
import { UpdateOrganizationalInformationDto } from './dto/update-organizational-information.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationalInformation } from './entities/organizational-information.entity';
import { HandleErrors } from 'src/common/handleErros';
import { isUUID } from 'class-validator';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OrganizationalInformationService {
  constructor(
    @InjectRepository(OrganizationalInformation)
    private readonly organizationalInformationRepository: Repository<OrganizationalInformation>,

    private readonly authService: AuthService
  ) { }

  async planeOrganizationalInformation(organizationalInformation: OrganizationalInformation) {
    const { preparedBy, ...rest } = organizationalInformation;
    const { password, roles, ...planePreparedBy } = preparedBy;
    
    const currentRoles = {      
      roles : roles.map(rol => {
        return rol.rol;
      })
    }

    return {
      ...rest,
      preparedBy: {
        ...planePreparedBy,
        ...currentRoles
      }
    }
  }

  async create(createOrganizationalInformationDto: CreateOrganizationalInformationDto) {

    const user = await this.authService.findOne(createOrganizationalInformationDto.preparedById);

    try {
      const organizationalInformation = this.organizationalInformationRepository.create({
        preparedBy: user,
        ...createOrganizationalInformationDto
      });
      await this.organizationalInformationRepository.save(organizationalInformation);
      return this.planeOrganizationalInformation(organizationalInformation);
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findAll() {
    const currentAmefs = await this.organizationalInformationRepository.find(
      {
        relations: {preparedBy: true}
      }
    )

    const amefs = currentAmefs.map((amef) => {
      return this.planeOrganizationalInformation(amef)
    })

    const planeAmefs = Promise.all(amefs)


    return planeAmefs
  }

  async findOne(term: string) {
    let organizationalInformation: OrganizationalInformation | null = null;

    if (isUUID(term)) {
      organizationalInformation = await this.organizationalInformationRepository.findOne(
        {
          where: {amefId: term},
          relations: {preparedBy: true, analysis: true}
        }
      );
    }


    if (!organizationalInformation) throw new NotFoundException('Organizational Information not found');


    return organizationalInformation;
  }

  async update(id: string, updateOrganizationalInformationDto: UpdateOrganizationalInformationDto) {
    const organizationalInformation = await this.organizationalInformationRepository.preload({
      amefId: id,
      ...updateOrganizationalInformationDto
    })

    if (!organizationalInformation) throw new NotFoundException('Organizational Information not found');

    try {
      return await this.organizationalInformationRepository.save(organizationalInformation)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} organizationalInformation`;
  }
}
