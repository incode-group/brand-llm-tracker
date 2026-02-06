export interface BrandContext {
  brandName: string;
  website: string;
  niche?: string[];
  keywords?: string[];
  description?: string;
}

export interface Competitor {
  name: string;
  website: string;
  strengths: string[];
  weaknesses: string[];
}

export interface GeneratedPrompt {
  id: string;
  text: string;
  category: 'identity' | 'comparison' | 'niche' | 'custom';
}

export interface IdentityAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  brand_perception: string;
  key_themes: string[];
}

export interface ComparisonAnalysis {
  competitor_name: string;
  better_product: 'current_brand' | 'competitor' | 'neutral';
  reasoning: string;
}

export interface MentionAnalysis {
  prompt_text: string;
  mentions_brand: boolean;
  context: string;
}

export interface LlmResponseResult {
  competitors: Competitor[];
  prompts: GeneratedPrompt[];
  analysis: {
    identity: IdentityAnalysis;
    comparison: ComparisonAnalysis[];
    mentions: MentionAnalysis[];
  };
}

export interface BrandCompetitorsGenerationContext {
  name: string;
  regions: string[];
  location: string;
  niche?: string[];
  keywords?: string[];
  description?: string;
}