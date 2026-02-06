import { Injectable, Logger } from '@nestjs/common';
import { LlmMentionsQuery, LlmMentionsResult } from './types';

@Injectable()
export class LlmMentionsService {
  private readonly logger = new Logger(LlmMentionsService.name);

  async checkMentions(query: LlmMentionsQuery): Promise<LlmMentionsResult> {
    this.logger.log(
      `Fetching external LLM mentions for brand: ${query.brandName}...`,
    );

    // Simulate API Latency
    // await new Promise(resolve => setTimeout(resolve, 500));

    // MOCK DATA
    const sentimentSeed = Math.random();
    const sentiment =
      sentimentSeed > 0.6
        ? 'positive'
        : sentimentSeed > 0.3
          ? 'neutral'
          : 'negative';

    return {
      total_mentions: Math.floor(Math.random() * 500) + 50,
      global_sentiment: sentiment,
      platform_breakdown: [
        {
          platform: 'ChatGPT',
          mention_count: Math.floor(Math.random() * 200),
          sentiment_score: 0.8,
        },
        {
          platform: 'Claude',
          mention_count: Math.floor(Math.random() * 100),
          sentiment_score: 0.6,
        },
        {
          platform: 'Gemini',
          mention_count: Math.floor(Math.random() * 150),
          sentiment_score: 0.9,
        },
        {
          platform: 'Perplexity',
          mention_count: Math.floor(Math.random() * 50),
          sentiment_score: 0.5,
        },
      ],
      top_related_topics: [
        ...(query.keywords || ['Innovation', 'Tech']),
        'Pricing',
        'User Experience',
      ],
      last_updated: new Date(),
    };
  }
}
