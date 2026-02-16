import { GeneratedPrompt } from '../types';

export type LLMInputTask = GeneratedPrompt;

export interface ExecutorOutput extends GeneratedPrompt {
  response: string;
  status: 'success' | 'error';
  timestamp: string;
}
