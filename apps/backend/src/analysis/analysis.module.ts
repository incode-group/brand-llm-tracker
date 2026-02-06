import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ANALYSIS_QUEUE } from '../bullmq/constants';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { AnalysisProcessor } from './analysis.processor';
import { ProgressGateway } from './progress.gateway';
import { ResearcherModule } from 'src/researcher/researcher.module';
import { LlmMentionsModule } from 'src/llm-mentions/llm-mentions.module';
import { LlmResponsesModule } from 'src/llm-responses/llm-responses.module';

@Module({
  imports: [
    ResearcherModule,
    LlmMentionsModule,
    LlmResponsesModule,
    BullModule.registerQueue({
      name: ANALYSIS_QUEUE,
    }),
    BullModule.registerFlowProducer({
      name: ANALYSIS_QUEUE,
    }),
  ],
  controllers: [AnalysisController],
  providers: [AnalysisService, AnalysisProcessor, ProgressGateway],
  exports: [ProgressGateway],
})
export class AnalysisModule {}
