import { Module } from '@nestjs/common';
import { LlmResponsesService } from './llm-responses.service';
import { CompetitorService } from './services/competitor.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { ResponseAnalysisService } from './services/response-analysis.service';
import { EvaluationService } from './services/evaluation.service';
import { GenAiModule } from '../gen-ai/gen-ai.module';
import { NicheService } from './analysis-modules/strategies/niche.service';
import { IdentityService } from './analysis-modules/strategies/identity.service';
import { ComparisonService } from './analysis-modules/strategies/comparison.service';
import { AuthorityService } from './analysis-modules/strategies/authority.service';

import { ExecutorModule } from './executor/executor.module';

@Module({
  imports: [GenAiModule, ExecutorModule],
  providers: [
    LlmResponsesService,
    CompetitorService,
    PromptGeneratorService,
    ResponseAnalysisService,
    NicheService,
    IdentityService,
    ComparisonService,
    AuthorityService,
    EvaluationService,
  ],
  exports: [LlmResponsesService],
})
export class LlmResponsesModule {}
