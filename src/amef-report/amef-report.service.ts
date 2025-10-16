import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getAmefReport } from 'src/reports/amef-report';
import { OrganizationalInformationService } from '../organizational-information/organizational-information.service';
import { OrganizationalInformation } from 'src/organizational-information/entities/organizational-information.entity';
import { buildAmefExcel } from 'src/reports/amef-excel';

@Injectable()
export class AmefReportService {

    constructor(
        private readonly printerService: PrinterService,

        private readonly organizationalInformationService: OrganizationalInformationService
    ) { }

    async getAmefReport(id: string) {

        const organizationalInformation = await this.organizationalInformationService.findOne(id);

        const docDefinition = getAmefReport(organizationalInformation);
        const doc = this.printerService.createPdf(docDefinition);

        return doc;
    }

    async getAmefExcel(id: string): Promise<Buffer> {
        const org = await this.organizationalInformationService.findOne(id);
        return buildAmefExcel(org);
    }
}
