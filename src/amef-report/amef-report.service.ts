import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { getAmefReport } from 'src/reports/amef-report';
import { OrganizationalInformationService } from '../organizational-information/organizational-information.service';

@Injectable()
export class AmefReportService {

    constructor(
        private readonly printerService: PrinterService,

        private readonly organizationalInformationService: OrganizationalInformationService
    ) {}

    async getAmefReport(id: string){

        const organizationalInformation = await this.organizationalInformationService.findOne(id);


        const docDefinition = getAmefReport(organizationalInformation);
        const doc = this.printerService.createPdf(docDefinition);

        return doc;
    }
}
