import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentAnalysis } from './entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    AuthModule,

    AnalysisModule,

    TypeOrmModule.forFeature([CommentAnalysis])
  ]
})
export class CommentsModule {}
