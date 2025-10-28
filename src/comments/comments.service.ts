import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ILike, Repository } from 'typeorm';
import { CommentAnalysis } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleErrors } from 'src/common/handleErros';
import { AuthService } from 'src/auth/auth.service';
import { AnalysisService } from 'src/analysis/analysis.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentAnalysis)
    private readonly commentAnalysisRepository: Repository<CommentAnalysis>,

    private readonly authService: AuthService,
    private readonly analysisService: AnalysisService,

  ) { }

  planeComments(comments: CommentAnalysis[]) {
    return comments.map(comments => {
      const { user, ...res } = comments
      const currenUser = {
        id: user.id,
        fullName: comments.user.fullName,
        email: comments.user.email,
        department: comments.user.departaments[0].department,
        rol: comments.user.roles[0].rol,
      }
      return {
        ...res,
        user: {
          ...currenUser
        },
      }
    })
  }

  async create(createCommentDto: CreateCommentDto) {
    const user = await this.authService.findOne(createCommentDto.userUuid)
    const analysis = await this.analysisService.findOne(createCommentDto.analysisUuid);

    try {
      const comment = this.commentAnalysisRepository.create({
        date: createCommentDto.date,
        user: user,
        analysis: analysis,
        comment: createCommentDto.comment
      })

      return this.commentAnalysisRepository.save(comment)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findAll() {

    const comments = await this.commentAnalysisRepository.find({
      relations: { user: true, analysis: true }
    })

    return this.planeComments(comments)
  }

  async findCommentsByAnalysisId(id: string) {

    try {
      const comments = await this.commentAnalysisRepository.find({
        where: {
          analysis: { id: id }
        },
        relations: { user: true, analysis: true },
      })
      return this.planeComments(comments)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findCommentsByAnalysisIdAnTerm(id: string, term: string) {

    try {
      const comments = await this.commentAnalysisRepository.find({
        where: {
          analysis: { id: id },
          comment: ILike(`%${term}%`)
        },
        relations: { user: true, analysis: true },
      })
      return this.planeComments(comments)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findCommentsByUserId(id: string, analysisId: string) {
    try {
      const comments = await this.commentAnalysisRepository.find({
        where: {
          user: { id: id },
          analysis: { id: analysisId },
        },
        relations: { user: true, analysis: true },
      })
      return this.planeComments(comments)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findCommentsByUserIdAndTerm(id: string, analysisId: string, term: string) {
    try {
      const comments = await this.commentAnalysisRepository.find({
        where: {
          user: { id: id },
          analysis: { id: analysisId },
          comment: ILike(`%${term}%`)
        },
        relations: { user: true, analysis: true },
      })
      return this.planeComments(comments)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentAnalysisRepository.preload({
      id,
      ...updateCommentDto
    })
    if (!comment) throw new NotFoundException(`Comment with ${id} not found`)
    try {
      return await this.commentAnalysisRepository.save(comment)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
