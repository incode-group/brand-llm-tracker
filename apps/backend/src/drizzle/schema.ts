import { pgTable, text, timestamp, uuid, jsonb, decimal, pgEnum } from 'drizzle-orm/pg-core';

export const analysisStatusEnum = pgEnum('analysis_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  brandName: text('brand_name').notNull(),
  domain: text('domain').notNull(),
  status: analysisStatusEnum('status').default('PENDING').notNull(),
  finalScore: decimal('final_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const brandContext = pgTable('brand_context', {
  id: uuid('id').primaryKey().defaultRandom(),
  analysisId: uuid('analysis_id').references(() => analyses.id).notNull(),
  niche: text('niche'),
  targetAudience: text('target_audience'),
  competitors: jsonb('competitors'), // Array of top competitors
  scrapedData: text('scraped_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const results = pgTable('results', {
  id: uuid('id').primaryKey().defaultRandom(),
  analysisId: uuid('analysis_id').references(() => analyses.id).notNull(),
  prompt: text('prompt').notNull(),
  model: text('model').notNull(),
  rawResponse: text('raw_response'),
  sentimentScore: decimal('sentiment_score', { precision: 5, scale: 2 }),
  rankScore: decimal('rank_score', { precision: 5, scale: 2 }),
  awarenessScore: decimal('awareness_score', { precision: 5, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
