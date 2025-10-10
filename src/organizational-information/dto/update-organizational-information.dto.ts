import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationalInformationDto } from './create-organizational-information.dto';

export class UpdateOrganizationalInformationDto extends PartialType(CreateOrganizationalInformationDto) {}
