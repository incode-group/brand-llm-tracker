import { Injectable, Logger } from '@nestjs/common';
import { BrandContext, GeneratedPrompt } from '../types';
import { PROMPTS } from '../utils/prompts';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PromptGeneratorService {
  private readonly logger = new Logger(PromptGeneratorService.name);

  async generateNichePrompts(
    context: BrandContext,
    count: number = 10,
  ): Promise<GeneratedPrompt[]> {
    this.logger.log(
      `Generating ${count} niche prompts for ${context.brandName}...`,
    );
    this.logger.debug(
      `Prompt used: ${PROMPTS.generateNichePrompts(context, count)}`,
    );

    // MOCK DATA
    const category = context.niche?.[0] || 'General';
    return Array.from({ length: count }).map((_, i) => ({
      id: uuidv4(),
      text: `What is the best ${category} solution for small businesses in 2024? (Mock Prompt ${i + 1})`,
      category: 'niche',
    }));
  }
}
