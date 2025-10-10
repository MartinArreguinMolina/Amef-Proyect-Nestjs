import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionService } from './action.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('amef/:amefId/analysis/:analysisId/actions')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @Post()
  create(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Body() createActionDto: CreateActionDto
  ) {
    return this.actionService.create(createActionDto, amefId, analysisId);
  }

  @Get()
  findAll(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string
  ) {
    return this.actionService.findAllByAnalysis(amefId, analysisId);
  }

  @Get(':id')
  findOne(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Param('id') id: string
  ) {
    return this.actionService.findOneInAnalysis(amefId, analysisId, id);
  }

  @Patch(':id')
  update(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto
  ) {
    return this.actionService.updateInAnalysis(amefId, analysisId, id, updateActionDto);
  }

  @Delete(':id')
  remove(
    @Param('amefId') amefId: string,
    @Param('analysisId') analysisId: string,
    @Param('id') id: string
  ) {
    return this.actionService.removeInAnalysis(amefId, analysisId, id);
  }
}
