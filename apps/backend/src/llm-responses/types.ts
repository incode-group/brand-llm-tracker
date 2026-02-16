export interface BrandContext {
  brandName: string;
  website: string;
  niche?: string[];
  keywords?: string[];
  description?: string;
}

export interface CategoryEvaluation {
  category: 'identity' | 'comparison' | 'niche' | 'authority';
  score: number;
  weight: number;
  weightedScore: number;
  details?: any;
}

export interface TotalEvaluation {
  totalScore: number;
  breakdown: {
    identity: CategoryEvaluation;
    comparison: CategoryEvaluation;
    niche: CategoryEvaluation;
    authority: CategoryEvaluation;
  };
  timestamp: string;
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
  category: 'identity' | 'comparison' | 'niche' | 'authority' | 'custom';
  metadata?: {
    fields_used?: string[];
    expected_insight?: string;
    difficulty?: number;
    strategy?: string;
  };
  response?: string;
  analysis?: NicheMentionAnalysis | ComparisonRankAnalysis | IdentityMatchAnalysis | AuthorityMentionAnalysis;
  status?: 'success' | 'error';
  timestamp?: string;
}

export interface NicheMentionAnalysis {
  category: 'niche';
  mentioned: boolean;
  reasoning: string;
}

export interface ComparisonRankAnalysis {
  category: 'comparison';
  brands_by_rank: string[];
  reasoning: string;
}

export interface IdentityMatchAnalysis {
  category: 'identity';
  score: number; // 0-10
  reasoning: string;
}

export interface AuthorityMentionAnalysis {
  category: 'authority';
  mentioned: boolean;
  reasoning: string;
}

export interface IdentityTestCase {
  prompt: string;
  fields_used: string[];
  expected_insight: string;
  difficulty: number;
}

export interface IdentityTestSuite {
  module: 'identity';
  brand_id: string;
  test_cases: IdentityTestCase[];
}

export interface ComparisonTestSuite {
  module: 'comparison';
  brand_id: string;
  test_cases: IdentityTestCase[];
}

export interface AuthorityTestCase {
  prompt: string;
  strategy: string;
  expected_insight: string;
  difficulty: number;
}

export interface AuthorityTestSuite {
  module: 'authority';
  brand_id: string;
  test_cases: AuthorityTestCase[];
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
    identity: IdentityAnalysis | null;
    comparison: ComparisonAnalysis[];
    mentions: MentionAnalysis[];
  };
  evaluation: TotalEvaluation;
}

export interface BrandCompetitorsGenerationContext {
  name: string;
  regions: string[];
  location: string;
  niche?: string[];
  keywords?: string[];
  description?: string;
}