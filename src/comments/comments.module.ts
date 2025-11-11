import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentAnalysis } from './entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { AnalysisModule } from 'src/analysis/analysis.module';
import { MessagesModule } from 'src/messages/messages.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [
    AuthModule,

    AnalysisModule,

    MessagesModule,

    TypeOrmModule.forFeature([CommentAnalysis])
  ],
  exports: [CommentsService]
})
export class CommentsModule {}
