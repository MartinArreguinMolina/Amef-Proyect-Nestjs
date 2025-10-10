import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { OrganizationalInformationModule } from 'src/organizational-information/organizational-information.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/analysis.entity';

@Module({
  controllers: [AnalysisController],
  providers: [AnalysisService],
  imports: [
    TypeOrmModule.forFeature([Analysis]),
    
    OrganizationalInformationModule
  ],
  exports: [AnalysisService],
})
export class AnalysisModule {}
