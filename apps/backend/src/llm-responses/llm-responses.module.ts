import { Module } from '@nestjs/common';
import { LlmResponsesService } from './llm-responses.service';
import { CompetitorService } from './services/competitor.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { ResponseAnalysisService } from './services/response-analysis.service';

@Module({
  providers: [
    LlmResponsesService,
    CompetitorService,
    PromptGeneratorService,
    ResponseAnalysisService,
  ],
  exports: [LlmResponsesService],
})
export class LlmResponsesModule {}
