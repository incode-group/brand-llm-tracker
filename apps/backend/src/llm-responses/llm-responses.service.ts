import { Injectable, Logger } from '@nestjs/common';
import { BrandCompetitorsGenerationContext, BrandContext, LlmResponseResult } from './types';
import { CompetitorService } from './services/competitor.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { ResponseAnalysisService } from './services/response-analysis.service';
import { Brand } from 'src/researcher/types';

import { ExecutorService } from './executor/executor.service';

import { EvaluationService } from './services/evaluation.service';

@Injectable()
export class LlmResponsesService {
  private readonly logger = new Logger(LlmResponsesService.name);

  constructor(
    private readonly competitorService: CompetitorService,
    private readonly promptGeneratorService: PromptGeneratorService,
    private readonly responseAnalysisService: ResponseAnalysisService,
    private readonly executorService: ExecutorService,
    private readonly evaluationService: EvaluationService,
  ) {}

  async processHarvest(brand: Brand): Promise<LlmResponseResult | null> {
    this.logger.log(`Starting LLM Response Harvest for ${brand.name}...`);

    if (!brand.researchResult) {
      throw new Error('No research result found');
    }

    const competitorGenerationContext: BrandCompetitorsGenerationContext = {
      name: brand.name,
      regions: brand.researchResult.marketPresence.otherRegions,
      location: brand.researchResult.marketPresence.mainLocation,
      niche: brand.researchResult.brandIdentity.niche,
      keywords: brand.researchResult.marketPresence.keywords,
      description: brand.researchResult.brandIdentity.description,
    };

    // 1. Generate Competitors
    const competitors =
      await this.competitorService.generateCompetitors(
        competitorGenerationContext,
      );
    this.logger.log(`Generated ${competitors.length} competitors.`);

    const brandContext: BrandContext = {
      brandName: brand.name,
      website: brand.website,
      niche: brand.researchResult.brandIdentity.niche,
      keywords: brand.researchResult.marketPresence.keywords,
      description: brand.researchResult.brandIdentity.description,
    };

    // 2. Generate Prompts (Multi-module AEO approach)
    const prompts = await this.promptGeneratorService.generateAllPrompts(
      brand,
      competitors,
    );
    this.logger.log(`Generated ${prompts.length} niche prompts.`);

    this.logger.debug('Prompts: ', JSON.stringify(prompts, null, 2));

    // 3. Execute Prompts
    this.logger.log(`Executing ${prompts.length} prompts...`);
    const executedPrompts = await this.executorService.execute(prompts);
    this.logger.log(`Execution complete.`);

    // 4. Analyze Responses
    this.logger.log(`Analyzing responses...`);
    const analyzedPrompts = await this.responseAnalysisService.analyzeResponses(brand, executedPrompts);
    this.logger.log(`Analysis complete for ${brand.name}.`);
    this.logger.debug('analysed prompts', JSON.stringify(analyzedPrompts.map(p => p.analysis), null, 2))

    // 5. Evaluate Results
    this.logger.log(`Evaluating results...`);
    const evaluation = this.evaluationService.evaluate(analyzedPrompts, brand.name);
    this.logger.log(`Evaluation complete. Total Score: ${evaluation.totalScore}`);
    this.logger.debug('evaluation', JSON.stringify(evaluation, null, 2));

    return {
      competitors,
      prompts: analyzedPrompts,
      analysis: {
        identity: null,
        comparison: [],
        mentions: [],
      },
      evaluation,
    };
  }
}
