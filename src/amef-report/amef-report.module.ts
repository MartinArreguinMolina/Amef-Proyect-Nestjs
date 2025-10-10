import { Module } from '@nestjs/common';
import { AmefReportService } from './amef-report.service';
import { AmefReportController } from './amef-report.controller';
import { PrinterModule } from '../printer/printer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationalInformationModule } from 'src/organizational-information/organizational-information.module';

@Module({
  controllers: [AmefReportController],
  providers: [AmefReportService],
  imports: [
    OrganizationalInformationModule,
    PrinterModule
  ],
})
export class AmefReportModule {}
