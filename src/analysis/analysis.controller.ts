import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';

@Controller('amef/:amefId/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) { }

  @Post()
  create(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Param('amefId') amefId: string
  ) {
    return this.analysisService.create(createAnalysisDto, amefId);
  }

  @Get()
  findAll(@Param('amefId') amefId: string) {
    return this.analysisService.findAllByAmef(amefId);
  }

  @Get(':analysisId')
  findOne(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string
  ) {
    return this.analysisService.findOneInAmef(amefId, analysisId);
  }

  @Patch(':analysisId')
  update(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Body() updateAnalysisDto: UpdateAnalysisDto
  ) {
    return this.analysisService.updateInAmef(amefId, analysisId, updateAnalysisDto);
  }

  @Delete(':analysisId')
  remove(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string
  ) {
    return this.analysisService.removeInAmef(amefId, analysisId);
  }
}
