export const ANALYSIS_QUEUE = 'analysis-queue';

export enum AnalysisStep {
  RESEARCH = 'research',
  HARVEST = 'harvest',
  JUDGE = 'judge',
  AGGREGATE = 'aggregate',

  LLM_MENTIONS = 'llm_mentions',
  LLM_RESPONSES = 'llm_responses',
}
