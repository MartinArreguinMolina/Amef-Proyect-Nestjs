import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { AnalysisService } from 'src/analysis/analysis.service';
import { HandleErrors } from 'src/common/handleErros';

@Injectable()
export class ActionService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,

    private readonly analysisService: AnalysisService,
  ) {}

  async create(dto: CreateActionDto, amefId: string, analysisId: string) {
    const analysis = await this.analysisService.findOneInAmef(amefId, analysisId);

    try {
      const newAction = this.actionRepository.create({
        ...dto as any,
        analysis,
        newNpr: this.calculateNewNpr(dto.newSeverity, dto.newOccurrence, dto.newDetection),
      });
      return await this.actionRepository.save(newAction);
    } catch (error) {
      HandleErrors.handleDBErrors(error);
    }
  }

  async findAllByAnalysis(amefId: string, analysisId: string) {
    return this.actionRepository.find({
      where: { analysis: { id: analysisId, organizationalInformation: { amefId } } },
      relations: ['analysis'],
    });
  }

  async findOneInAnalysis(amefId: string, analysisId: string, id: string) {
    const action = await this.actionRepository.findOne({
      where: { id, analysis: { id: analysisId, organizationalInformation: { amefId } } },
      relations: ['analysis'],
    });

    if (!action) throw new NotFoundException(`Action with id '${id}' not found in analysis '${analysisId}' of AMEF '${amefId}'`);

    return action;
  }

  async updateInAnalysis(amefId: string, analysisId: string, id: string, dto: UpdateActionDto) {
    const action = await this.findOneInAnalysis(amefId, analysisId, id);

    const S = dto.newSeverity ?? action.newSeverity;
    const O = dto.newOccurrence ?? action.newOccurrence;
    const D = dto.newDetection ?? action.newDetection;

    action.newNpr = (S && O && D) ? S * O * D : action.newNpr;

    Object.assign(action, dto);

    return this.actionRepository.save(action);
  }

  async removeInAnalysis(amefId: string, analysisId: string, id: string) {
    const action = await this.findOneInAnalysis(amefId, analysisId, id);
    return this.actionRepository.remove(action);
  }

  private calculateNewNpr(S?: number, O?: number, D?: number): number | null {
    if (S && O && D) return S * O * D;
    return null;
  }
}
