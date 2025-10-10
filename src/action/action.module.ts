import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './entities/action.entity';
import { AnalysisModule } from 'src/analysis/analysis.module';

@Module({
  controllers: [ActionController],
  providers: [ActionService],
  imports: [
    TypeOrmModule.forFeature([Action]),


    AnalysisModule
  ]
})
export class ActionModule {}
