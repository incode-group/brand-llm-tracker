import { Injectable, Logger } from '@nestjs/common';
import { BrandResearchResult } from './types';
import { researcherPrompt } from './utils/researcher.prompts';
import { parseLLMJson } from './utils/researcher.parser';
import { GenAiService } from '../gen-ai/gen-ai.service';

@Injectable()
export class ResearcherService {
  private readonly logger = new Logger(ResearcherService.name);

  constructor(private readonly genAiService: GenAiService) {}

  async analyzeBrand(
    brandName: string,
    website: string,
    location: string,
  ): Promise<BrandResearchResult> {
    this.logger.log(
      `Starting analysis for brand: ${brandName} (${website}) (${location})`,
    );

    const prompt = researcherPrompt(brandName, website, location);

    this.logger.debug('Generating LLM prompt with Google Gemini...');

    try {
      const text = await this.genAiService.generateText(prompt);

      const parsedResult = parseLLMJson<BrandResearchResult>(text);

      this.logger.log(
        'Received response from LLM.',
        JSON.stringify(parsedResult, null, 2),
      );

      if (!text) {
        throw new Error('Empty response from LLM');
      }

      this.logger.log(
        `Analysis complete for ${brandName}. Score: ${parsedResult.metadata.confidenceScore}`,
      );

      return parsedResult;
    } catch (error) {
      this.logger.error(`Failed to analyze brand ${brandName}`, error);
      throw error;
    }
  }
}
