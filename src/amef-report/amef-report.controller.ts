import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { AmefReportService } from './amef-report.service';
import { Response } from 'express';

@Controller('amef-report')
export class AmefReportController {
  constructor(private readonly amefReportService: AmefReportService) { }

  @Get(':id/pdf')
  async generateAmefReport(@Param('id', ParseUUIDPipe) id: string, @Res() response: Response) {
    const pdfDoc = await this.amefReportService.getAmefReport(id);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Amef ${id}`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('example')
  async example(@Res() response: Response) {
    console.log('Generating example AMEF report');
    const pdfDoc = await this.amefReportService.example();
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Amef example`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get(':id/amef')
  async exportExcel(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const buf = await this.amefReportService.getAmefExcel(id);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="amef-${id}.xlsx"`);
    res.send(buf);
  }
}
