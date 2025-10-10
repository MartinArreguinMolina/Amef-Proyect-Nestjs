import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';

@Controller('amef/:amefId/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Crear un análisis para un AMEF
  @Post()
  create(
    @Body() createAnalysisDto: CreateAnalysisDto,
    @Param('amefId') amefId: string
  ) {
    return this.analysisService.create(createAnalysisDto, amefId);
  }

  // Obtener todos los análisis de un AMEF
  @Get()
  findAll(@Param('amefId') amefId: string) {
    return this.analysisService.findAllByAmef(amefId);
  }

  // Obtener un análisis específico de un AMEF
  @Get(':analysisId')
  findOne(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string
  ) {
    return this.analysisService.findOneInAmef(amefId, analysisId);
  }

  // Actualizar un análisis específico
  @Patch(':analysisId')
  update(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Body() updateAnalysisDto: UpdateAnalysisDto
  ) {
    return this.analysisService.updateInAmef(amefId, analysisId, updateAnalysisDto);
  }

  // Eliminar un análisis específico
  @Delete(':analysisId')
  remove(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string
  ) {
    return this.analysisService.removeInAmef(amefId, analysisId);
  }
}
