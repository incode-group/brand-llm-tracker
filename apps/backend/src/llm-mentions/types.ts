export interface LlmMentionsQuery {
  brandName: string;
  niche?: string[];
  keywords?: string[];
  description?: string;
}

export interface PlatformStats {
  platform: 'ChatGPT' | 'Claude' | 'Gemini' | 'Perplexity' | 'Other';
  mention_count: number;
  sentiment_score: number; // -1 to 1
}

export interface LlmMentionsResult {
  total_mentions: number;
  global_sentiment: 'positive' | 'neutral' | 'negative';
  platform_breakdown: PlatformStats[];
  top_related_topics: string[];
  last_updated: Date;
}
