import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { AmefReportService } from './amef-report.service';
import { Response } from 'express';

@Controller('amef-report')
export class AmefReportController {
  constructor(private readonly amefReportService: AmefReportService) { }

  @Get(':id')
  async generateAmefReport(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
    const pdfDoc = await this.amefReportService.getAmefReport(id);

    response.setHeader('Content-Type', 'application/pdf')
    pdfDoc.info.Title = `Amef ${id}`
    pdfDoc.pipe(response);
    pdfDoc.end()
  }
}

