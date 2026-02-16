import { Injectable, Logger } from '@nestjs/common';
import { BaseAnalysisStrategy, StrategyPrompt } from '../base.module';
import { SYSTEM_PROMPTS } from '../../constants/system-prompts';
import { GenAiService } from '../../../gen-ai/gen-ai.service';
import { Brand } from 'src/researcher/types';
import { Competitor } from '../../types';

@Injectable()
export class NicheService extends BaseAnalysisStrategy {
  private readonly logger = new Logger(NicheService.name);

  constructor(private readonly genAiService: GenAiService) {
    super();
  }

  async generatePrompts(context: Brand): Promise<StrategyPrompt[]> {
    this.logger.log(`Generating niche prompts for ${context.name}...`);
    
    const systemPrompt = SYSTEM_PROMPTS.generateNichePrompts(context, 3);
    
    try {
      const response = await this.genAiService.generateText(systemPrompt);
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const promptTexts: string[] = JSON.parse(cleanedResponse);
      return promptTexts.map((text) => ({ text }));
    } catch (error) {
      this.logger.error(`Failed to generate niche prompts: ${error.message}`);
      return [];
    }
  }
}
