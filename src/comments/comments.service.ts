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
import { MessagesGateway } from 'src/messages/messages.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentAnalysis)
    private readonly commentAnalysisRepository: Repository<CommentAnalysis>,

    private readonly authService: AuthService,
    private readonly analysisService: AnalysisService,

    private readonly messagesGateway: MessagesGateway,

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
    const [user,analysis] = await Promise.all([
      this.authService.findOne(createCommentDto.userUuid),
      this.analysisService.findOne(createCommentDto.analysisUuid)
    ])

    try {
      const comment = this.commentAnalysisRepository.create({
        user: user,
        analysis: analysis,
        comment: createCommentDto.comment
      })

      const currentComment = await this.commentAnalysisRepository.save(comment)
      const planeComment = this.planeComments([currentComment])[0];
      this.messagesGateway.emitCommentNew(analysis.id, planeComment);
      return currentComment;
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  async findOne(id: string){
    let comment: CommentAnalysis | null = null;

    comment = await this.commentAnalysisRepository.findOneBy({id})

    if(!comment) throw new NotFoundException('El comentario no fue encontrado')

      return comment;
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
        order: { createdAt: 'ASC' }
      })
      const currentComments = this.planeComments(comments)
      return currentComments
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
        order: { createdAt: 'ASC' }
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
        order: { createdAt: 'ASC' }
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

    const curretComment = await this.commentAnalysisRepository.findOne({
      where: { id: id },
      relations: { analysis: true }
    })

    const idAnalysis = curretComment?.analysis.id!;

    try {
      const currenComment = await this.commentAnalysisRepository.save(comment)
      this.messagesGateway.updateComment(idAnalysis, currenComment);
      return currenComment
    } catch (error) {
      console.log(error);
      HandleErrors.handleDBErrors(error)
    }
  }

 async remove(id: string) {
    const comment = await this.findOne(id)

    try{
      await this.commentAnalysisRepository.remove(comment);

      this.messagesGateway.deleteComment(comment.analysis.id, comment)

      return {message: 'El comentario fue eliminado exitosamente'}
    }catch(error){
      HandleErrors.handleDBErrors(error)
    }
  }
}
