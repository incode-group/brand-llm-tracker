import { Injectable, Logger } from '@nestjs/common';
import {
  BrandContext,
  Competitor,
  GeneratedPrompt,
  IdentityAnalysis,
  ComparisonAnalysis,
  MentionAnalysis,
} from '../types';
import { PROMPTS } from '../utils/prompts';

@Injectable()
export class ResponseAnalysisService {
  private readonly logger = new Logger(ResponseAnalysisService.name);

  // Step 1: Identity Analysis
  async analyzeIdentity(context: BrandContext): Promise<IdentityAnalysis> {
    this.logger.log(`Analyzing identity for ${context.brandName}...`);
    this.logger.debug(`Prompt: ${PROMPTS.analyzeIdentity(context)}`);

    return {
      sentiment: 'positive',
      brand_perception: 'Innovative and reliable market leader.',
      key_themes: ['Quality', 'Enterprise-ready', 'Scalable'],
    };
  }

  // Step 2: Comparison Analysis
  async compareBrands(
    context: BrandContext,
    competitors: Competitor[],
  ): Promise<ComparisonAnalysis[]> {
    this.logger.log(
      `Comparing ${context.brandName} against ${competitors.length} competitors...`,
    );

    return competitors.map((competitor) => {
      this.logger.debug(
        `Comparing vs ${competitor.name}: ${PROMPTS.compareBrand(context, competitor)}`,
      );
      // Randomly assign winner for mock variety
      const outcome = Math.random() > 0.5 ? 'current_brand' : 'competitor';

      return {
        competitor_name: competitor.name,
        better_product: outcome,
        reasoning:
          outcome === 'current_brand'
            ? 'Better user experience and pricing.'
            : 'More advanced enterprise features.',
      };
    });
  }

  // Step 3: Mention Check
  async checkMentions(
    context: BrandContext,
    prompts: GeneratedPrompt[],
  ): Promise<MentionAnalysis[]> {
    this.logger.log(
      `Checking mentions for ${context.brandName} across ${prompts.length} prompts...`,
    );

    return prompts.map((prompt) => {
      this.logger.debug(`Running prompt: ${PROMPTS.mentionCheck(prompt.text)}`);

      const isMentioned = Math.random() > 0.7; // 30% chance of mention

      return {
        prompt_text: prompt.text,
        mentions_brand: isMentioned,
        context: isMentioned
          ? `The model explicitly recommended ${context.brandName} as a top choice.`
          : 'The model suggested other competitors.',
      };
    });
  }
}
