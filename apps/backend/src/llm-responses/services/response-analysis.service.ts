import { Injectable, Logger } from '@nestjs/common';
import {
  BrandContext,
  GeneratedPrompt,
  NicheMentionAnalysis,
  ComparisonRankAnalysis,
  IdentityMatchAnalysis,
  AuthorityMentionAnalysis,
} from '../types';
import { SYSTEM_PROMPTS } from '../constants/system-prompts';
import { Brand } from 'src/researcher/types';
import { GenAiService } from 'src/gen-ai/gen-ai.service';

@Injectable()
export class ResponseAnalysisService {
  private readonly logger = new Logger(ResponseAnalysisService.name);

  constructor(private readonly genAiService: GenAiService) {}

  /**
   * Gateway method to analyze all generated prompts with responses
   */
  async analyzeResponses(brand: Brand, prompts: GeneratedPrompt[]): Promise<GeneratedPrompt[]> {
    this.logger.log(`Analyzing ${prompts.length} responses for brand: ${brand.name}`);

    const analyzedPrompts: GeneratedPrompt[] = [];

    let currentPromptIndex = 1;

    for (const prompt of prompts) {
      if (!prompt.response || prompt.status === 'error') {
        analyzedPrompts.push(prompt);
        continue;
      }

      try {
        let analysis: any;

        switch (prompt.category) {
          case 'niche':
            analysis = await this.analyzeNichePrompt(brand, prompt);
            break;
          case 'comparison':
            analysis = await this.analyzeComparisonPrompt(brand, prompt);
            break;
          case 'identity':
            analysis = await this.analyzeIdentityPrompt(brand, prompt);
            break;
          case 'authority':
            analysis = await this.analyzeAuthorityPrompt(brand, prompt);
            break;
          default:
            this.logger.warn(`Unknown prompt category: ${prompt.category}`);
            analyzedPrompts.push(prompt);
            continue;
        }

        console.log(`analyzed prompt ${currentPromptIndex++}/${prompts.length}`);


        analyzedPrompts.push({
          ...prompt,
          analysis,
        });

        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        this.logger.error(`Failed to analyze prompt ${prompt.id}: ${error.message}`);
        analyzedPrompts.push(prompt);
      }
    }


    return analyzedPrompts;
  }

  private async analyzeNichePrompt(brand: Brand, prompt: GeneratedPrompt): Promise<NicheMentionAnalysis> {
    const systemPrompt = SYSTEM_PROMPTS.analyzeNicheMention(brand, prompt.response!);
    const rawResult = await this.genAiService.generateText(systemPrompt);
    const result = JSON.parse(this.cleanJsonResponse(rawResult));

    return {
      category: 'niche',
      mentioned: result.mentioned,
      reasoning: result.reasoning,
    };
  }

  private async analyzeComparisonPrompt(brand: Brand, prompt: GeneratedPrompt): Promise<ComparisonRankAnalysis> {
    const systemPrompt = SYSTEM_PROMPTS.analyzeComparisonRank(brand, prompt.response!);
    const rawResult = await this.genAiService.generateText(systemPrompt);
    const result = JSON.parse(this.cleanJsonResponse(rawResult));

    return {
      category: 'comparison',
      brands_by_rank: result.brands_by_rank,
      reasoning: result.reasoning,
    };
  }

  private async analyzeIdentityPrompt(brand: Brand, prompt: GeneratedPrompt): Promise<IdentityMatchAnalysis> {
    const expectedInsight = prompt.metadata?.expected_insight || 'No expected insight provided';
    const systemPrompt = SYSTEM_PROMPTS.analyzeIdentityMatch(expectedInsight, prompt.response!);
    const rawResult = await this.genAiService.generateText(systemPrompt);
    const result = JSON.parse(this.cleanJsonResponse(rawResult));

    return {
      category: 'identity',
      score: result.score,
      reasoning: result.reasoning,
    };
  }

  private async analyzeAuthorityPrompt(brand: Brand, prompt: GeneratedPrompt): Promise<AuthorityMentionAnalysis> {
    const systemPrompt = SYSTEM_PROMPTS.analyzeAuthorityMention(brand, prompt.response!);
    const rawResult = await this.genAiService.generateText(systemPrompt);
    const result = JSON.parse(this.cleanJsonResponse(rawResult));

    return {
      category: 'authority',
      mentioned: result.mentioned,
      reasoning: result.reasoning,
    };
  }

  private cleanJsonResponse(text: string): string {
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  }
}
