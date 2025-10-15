import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { OrganizationalInformationService } from './organizational-information.service';
import { CreateOrganizationalInformationDto } from './dto/create-organizational-information.dto';
import { UpdateOrganizationalInformationDto } from './dto/update-organizational-information.dto';

@Controller('organizational-information')
export class OrganizationalInformationController {
  
  constructor(private readonly organizationalInformationService: OrganizationalInformationService) {}

  @Post()
  create(@Body() createOrganizationalInformationDto: CreateOrganizationalInformationDto) {
    return this.organizationalInformationService.create(createOrganizationalInformationDto);
  }

  @Get()
  findAll() {
    return this.organizationalInformationService.findAll();
  }

  @Get('findAllByTerm/:term')
  findAllByTerm(@Param('term') term: string){
    return this.organizationalInformationService.findAllByTerm(term)
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.organizationalInformationService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrganizationalInformationDto: UpdateOrganizationalInformationDto) {
    return this.organizationalInformationService.update(id, updateOrganizationalInformationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organizationalInformationService.remove(+id);
  }
}
