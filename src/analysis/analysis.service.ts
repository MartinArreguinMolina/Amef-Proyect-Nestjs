import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { OrganizationalInformationService } from 'src/organizational-information/organizational-information.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entity';
import { Repository } from 'typeorm';
import { HandleErrors } from 'src/common/handleErros';
import { isUUID } from 'class-validator';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private readonly analysisRepository: Repository<Analysis>,

    private readonly organizationalInformationService: OrganizationalInformationService,

  ) { }

  async create(createAnalysisDto: CreateAnalysisDto, amefId: string) {
    const organizationalInformation = await this.organizationalInformationService.findOne(amefId);

    try {
      const npr = createAnalysisDto.severity * createAnalysisDto.occurrence * createAnalysisDto.detection;

      const analysis = this.analysisRepository.create({
        organizationalInformation: organizationalInformation,
        npr,
        ...createAnalysisDto,
      });

      const currentAnalysis = await this.analysisRepository.save(analysis);

      return currentAnalysis;
    } catch (error) {
      HandleErrors.handleDBErrors(error);
    }
  }

  async findAllByAmef(amefId: string) {
    return this.analysisRepository.find({
      where: { organizationalInformation: { amefId } },
      relations: ['organizationalInformation'],
    });
  }

  async findOneInAmef(amefId: string, analysisId: string) {
    const analysis = await this.analysisRepository.findOne({
      where: { id: analysisId, organizationalInformation: { amefId } },
      relations: ['organizationalInformation'],
    });
    if (!analysis) throw new NotFoundException(`Analysis no encontrado en AMEF ${amefId}`);
    return analysis;
  }

  async updateInAmef(amefId: string, analysisId: string, dto: UpdateAnalysisDto) {
    const analysis = await this.findOneInAmef(amefId, analysisId);
    const severity = dto.severity ?? analysis.severity;
    const occurrence = dto.occurrence ?? analysis.occurrence;
    const detection = dto.detection ?? analysis.detection;

    analysis.npr = severity * occurrence * detection;

    Object.assign(analysis, dto);

    return this.analysisRepository.save(analysis);
  }


  async removeInAmef(amefId: string, analysisId: string) {
    const analysis = await this.findOneInAmef(amefId, analysisId);
    return this.analysisRepository.remove(analysis);
  }


  findAll() {
    return this.analysisRepository.find();
  }

  async findOne(id: string) {
    let analysis: Analysis | null = null;

    if (isUUID(id)) {
      analysis = await this.analysisRepository.findOne({
        where: {id},
        relations: {organizationalInformation: true }
      });
    }

    if (!analysis) {
      throw new NotFoundException(`Analysis with id ${id} not found`);
    }

    return analysis;
  }

  update(id: number, updateAnalysisDto: UpdateAnalysisDto) {
    return `This action updates a #${id} analysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} analysis`;
  }
}
