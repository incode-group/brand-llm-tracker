import { Injectable, Logger } from '@nestjs/common';
import { BaseAnalysisStrategy, StrategyPrompt } from '../base.module';
import { SYSTEM_PROMPTS } from '../../constants/system-prompts';
import { GenAiService } from '../../../gen-ai/gen-ai.service';
import { Brand } from 'src/researcher/types';
import { ComparisonTestSuite, Competitor } from '../../types';

@Injectable()
export class ComparisonService extends BaseAnalysisStrategy {
  private readonly logger = new Logger(ComparisonService.name);

  constructor(private readonly genAiService: GenAiService) {
    super();
  }

  async generatePrompts(brand: Brand, competitors: Competitor[]): Promise<StrategyPrompt[]> {
    this.logger.log(`Generating comparison diagnostic test suite for ${brand.name}...`);
    
    if (!competitors || competitors.length === 0) {
      this.logger.warn(`No competitors provided for ${brand.name}, skipping comparison prompts.`);
      return [];
    }

    const systemPrompt = SYSTEM_PROMPTS.generateComparisonTestSuite(brand, competitors);
    
    try {
      const response = await this.genAiService.generateText(systemPrompt);
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const suite: ComparisonTestSuite = JSON.parse(cleanedResponse);

      return suite.test_cases.map((testCase) => ({
        text: testCase.prompt,
        metadata: {
          fields_used: testCase.fields_used,
          expected_insight: testCase.expected_insight,
          difficulty: testCase.difficulty,
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to generate comparison test suite: ${error.message}`);
      return [];
    }
  }
}
