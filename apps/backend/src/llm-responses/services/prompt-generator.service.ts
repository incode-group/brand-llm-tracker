import { Injectable, Logger } from '@nestjs/common';
import { GeneratedPrompt } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { NicheService } from '../analysis-modules/strategies/niche.service';
import { IdentityService } from '../analysis-modules/strategies/identity.service';
import { ComparisonService } from '../analysis-modules/strategies/comparison.service';
import { AuthorityService } from '../analysis-modules/strategies/authority.service';
import { Brand } from 'src/researcher/types';
import { Competitor } from '../types';

@Injectable()
export class PromptGeneratorService {
  private readonly logger = new Logger(PromptGeneratorService.name);

  constructor(
    private readonly nicheService: NicheService,
    private readonly identityService: IdentityService,
    private readonly comparisonService: ComparisonService,
    private readonly authorityService: AuthorityService,
  ) {}

  async generateAllPrompts(
    brand: Brand,
    competitors: Competitor[],
  ): Promise<GeneratedPrompt[]> {
    this.logger.log(`Generating prompts sequentially for ${brand.name} to avoid rate limits...`);

    const nichePrompts = await this.nicheService.generatePrompts(brand);
    const identityPrompts = await this.identityService.generatePrompts(brand);
    const comparisonPrompts = await this.comparisonService.generatePrompts(brand, competitors);
    const authorityPrompts = await this.authorityService.generatePrompts(brand, competitors);

    const promptData = [
      { items: nichePrompts, category: 'niche' as const },
      { items: identityPrompts, category: 'identity' as const },
      { items: comparisonPrompts, category: 'comparison' as const },
      { items: authorityPrompts, category: 'authority' as const },
    ];

    return promptData.flatMap(({ items, category }) =>
      items.map((p) => ({
        id: uuidv4(),
        text: p.text,
        category,
        metadata: p.metadata,
      }))
    );
  }
}
