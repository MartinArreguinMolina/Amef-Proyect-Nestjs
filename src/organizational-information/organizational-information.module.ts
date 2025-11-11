import { Module } from '@nestjs/common';
import { OrganizationalInformationService } from './organizational-information.service';
import { OrganizationalInformationController } from './organizational-information.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalInformation } from './entities/organizational-information.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [OrganizationalInformationController],
  providers: [
    OrganizationalInformationService
  ],
  imports: [
    TypeOrmModule.forFeature([OrganizationalInformation]),

    AuthModule,
  ],
  exports: [
    OrganizationalInformationService,
  ]
})
export class OrganizationalInformationModule { }
