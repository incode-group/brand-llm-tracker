import { Injectable, Logger } from '@nestjs/common';
import { BrandCompetitorsGenerationContext, BrandContext, Competitor } from '../types';
import { PROMPTS } from '../utils/prompts';
import { Brand } from 'src/researcher/types';
import { GenAiService } from 'src/gen-ai/gen-ai.service';

@Injectable()
export class CompetitorService {
  private readonly logger = new Logger(CompetitorService.name);

  constructor(private readonly genAiService: GenAiService) {}

  async generateCompetitors(context: BrandCompetitorsGenerationContext): Promise<Competitor[]> {
    this.logger.log(`Generating competitors for ${context.name}...`);
    const prompt = PROMPTS.generateCompetitors(context);

    try {
      const response = await this.genAiService.generateText(prompt);
      
      const competitors = this.parseCompetitorsResponse(response);

      this.logger.debug(JSON.stringify(competitors, null, 2));
      
      this.logger.log(`Successfully generated ${competitors.length} competitors for ${context.name}`);
      return competitors;
    } catch (error) {
      this.logger.error(`Failed to generate competitors for ${context.name}`, error);
      throw error;
    }
  }

  private parseCompetitorsResponse(response: string): Competitor[] {
    try {
      // Remove markdown code blocks if present
      let cleanedResponse = response.trim();
      
      // Remove ```json and ``` markers
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      const parsed = JSON.parse(cleanedResponse.trim());
      
      // Validate the structure
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array');
      }
      
      // Validate each competitor has required fields
      const competitors = parsed.map((comp: any) => {
        if (!comp.name || !comp.website || !Array.isArray(comp.strengths) || !Array.isArray(comp.weaknesses)) {
          throw new Error('Invalid competitor structure');
        }
        return {
          name: comp.name,
          website: comp.website,
          strengths: comp.strengths,
          weaknesses: comp.weaknesses,
        } as Competitor;
      });
      
      return competitors;
    } catch (error) {
      this.logger.error('Failed to parse competitors response', error);
      this.logger.debug('Raw response:', response);
      throw new Error(`Failed to parse LLM response: ${error.message}`);
    }
  }
}
