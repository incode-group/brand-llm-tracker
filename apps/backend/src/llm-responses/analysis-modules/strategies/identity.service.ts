import { Injectable, Logger } from '@nestjs/common';
import { BaseAnalysisStrategy, StrategyPrompt } from '../base.module';
import { SYSTEM_PROMPTS } from '../../constants/system-prompts';
import { GenAiService } from '../../../gen-ai/gen-ai.service';
import { Brand } from 'src/researcher/types';
import { IdentityTestSuite } from '../../types';

@Injectable()
export class IdentityService extends BaseAnalysisStrategy {
  private readonly logger = new Logger(IdentityService.name);

  constructor(private readonly genAiService: GenAiService) {
    super();
  }

  async generatePrompts(brand: Brand): Promise<StrategyPrompt[]> {
    this.logger.log(`Generating identity diagnostic test suite for ${brand.name}...`);
    
    const systemPrompt = SYSTEM_PROMPTS.generateIdentityTestSuite(brand);
    
    try {
      const response = await this.genAiService.generateText(systemPrompt);
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const suite: IdentityTestSuite = JSON.parse(cleanedResponse);

      return suite.test_cases.map((testCase) => ({
        text: testCase.prompt,
        metadata: {
          fields_used: testCase.fields_used,
          expected_insight: testCase.expected_insight,
          difficulty: testCase.difficulty,
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to generate identity test suite: ${error.message}`);
      return [];
    }
  }
}
