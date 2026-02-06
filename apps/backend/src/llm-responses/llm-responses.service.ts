import { Injectable, Logger } from '@nestjs/common';
import { BrandCompetitorsGenerationContext, BrandContext, LlmResponseResult } from './types';
import { CompetitorService } from './services/competitor.service';
import { PromptGeneratorService } from './services/prompt-generator.service';
import { ResponseAnalysisService } from './services/response-analysis.service';
import { Brand } from 'src/researcher/types';

@Injectable()
export class LlmResponsesService {
  private readonly logger = new Logger(LlmResponsesService.name);

  constructor(
    private readonly competitorService: CompetitorService,
    private readonly promptGeneratorService: PromptGeneratorService,
    private readonly responseAnalysisService: ResponseAnalysisService,
  ) {}

  async processHarvest(brand: Brand): Promise<LlmResponseResult | null> {
    this.logger.log(
      `Starting LLM Response Harvest for ${brand.name}...`,
    );

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
      await this.competitorService.generateCompetitors(competitorGenerationContext);
    this.logger.log(`Generated ${competitors.length} competitors.`);

    // 2. Generate Prompts
    // const prompts = await this.promptGeneratorService.generateNichePrompts(
    //   context,
    //   10,
    // );
    // this.logger.log(`Generated ${prompts.length} niche prompts.`);

    // // 3. 3-Step Analysis
    // // 3a. Identity
    // const identityAnalysis =
    //   await this.responseAnalysisService.analyzeIdentity(context);

    // // 3b. Comparison (Parallelized)
    // const comparisonAnalysis = await this.responseAnalysisService.compareBrands(
    //   context,
    //   competitors,
    // );

    // // 3c. Mention Check (Parallelized)
    // const mentionAnalysis = await this.responseAnalysisService.checkMentions(
    //   context,
    //   prompts,
    // );

    // this.logger.log(`Analysis complete for ${context.brandName}.`);

    // return {
    //   competitors,
    //   prompts,
    //   analysis: {
    //     identity: identityAnalysis,
    //     comparison: comparisonAnalysis,
    //     mentions: mentionAnalysis,
    //   },
    // };

    return null;
  }
}
