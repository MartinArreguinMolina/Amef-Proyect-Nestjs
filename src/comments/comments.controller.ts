import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  async findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  async findCommentsByAnalysisId(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.findCommentsByAnalysisId(id);
  }

  @Get(':id/:term')
  async findCommentsByAnalysisIdAndTerm(@Param('id', ParseUUIDPipe) id: string, @Param('term') term: string) {
    return this.commentsService.findCommentsByAnalysisIdAnTerm(id, term);
  }

  @Get('user/:id/analysisId/:analysisId')
  async findCommentsByUserId(@Param('id', ParseUUIDPipe) id: string, @Param('analysisId') analysisId: string) {
    return this.commentsService.findCommentsByUserId(id, analysisId);
  }

  @Get('user/:id/analysisId/:analysisId/:term')
  async findCommentsByUserIdAndTerm(@Param('id', ParseUUIDPipe) id: string, @Param('analysisId') analysisId: string, @Param('term') term: string) {
    return this.commentsService.findCommentsByUserIdAndTerm(id, analysisId, term);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
