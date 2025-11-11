import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  providers: [MessagesGateway, MessagesService],
  exports: [MessagesGateway],
  imports: [AnalysisModule]
})
export class MessagesModule {}
