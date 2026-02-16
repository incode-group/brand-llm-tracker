import { Brand } from 'src/researcher/types';
import { Competitor } from '../types';

export interface StrategyPrompt {
  text: string;
  metadata?: {
    fields_used?: string[];
    expected_insight?: string;
    difficulty?: number;
  };
}

export abstract class BaseAnalysisStrategy {
  abstract generatePrompts(brand: Brand, competitors?: Competitor[]): Promise<StrategyPrompt[]>;
}
