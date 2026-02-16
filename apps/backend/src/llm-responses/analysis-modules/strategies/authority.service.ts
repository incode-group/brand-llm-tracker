import { Injectable, Logger } from '@nestjs/common';
import { BaseAnalysisStrategy, StrategyPrompt } from '../base.module';
import { SYSTEM_PROMPTS } from '../../constants/system-prompts';
import { GenAiService } from '../../../gen-ai/gen-ai.service';
import { Brand } from 'src/researcher/types';
import { AuthorityTestSuite, Competitor } from '../../types';

@Injectable()
export class AuthorityService extends BaseAnalysisStrategy {
  private readonly logger = new Logger(AuthorityService.name);

  constructor(private readonly genAiService: GenAiService) {
    super();
  }

  async generatePrompts(brand: Brand, competitors?: Competitor[]): Promise<StrategyPrompt[]> {
    this.logger.log(`Generating authority diagnostic test suite for ${brand.name}...`);
    
    const systemPrompt = SYSTEM_PROMPTS.generateAuthorityTestSuite(brand);
    
    try {
      const response = await this.genAiService.generateText(systemPrompt);
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const suite: AuthorityTestSuite = JSON.parse(cleanedResponse);

      return suite.test_cases.map((testCase) => ({
        text: testCase.prompt,
        metadata: {
          strategy: testCase.strategy,
          expected_insight: testCase.expected_insight,
          difficulty: testCase.difficulty,
        },
      }));
    } catch (error) {
      this.logger.error(`Failed to generate authority test suite: ${error.message}`);
      return [];
    }
  }
}
