import { Injectable, Logger } from '@nestjs/common';
import { LLMInputTask, ExecutorOutput } from './types';
import { GenAiService } from '../../gen-ai/gen-ai.service';

@Injectable()
export class ExecutorService {
  private readonly logger = new Logger(ExecutorService.name);

  constructor(private readonly genAiService: GenAiService) {}

  async execute(tasks: LLMInputTask[]): Promise<ExecutorOutput[]> {
    this.logger.log(`Executing ${tasks.length} LLM tasks`);

    return Promise.all(
      tasks.map(async (task) => {
        try {
          const response = await this.genAiService.generateText(task.text);

          return {
            ...task,
            response: response,
            status: 'success' as const,
            timestamp: new Date().toISOString(),
          };
        } catch (error) {
          this.logger.error(`Error executing task ${task.id}: ${error.message}`);
          return {
            ...task,
            response: `Execution Error: ${error.message}`,
            status: 'error' as const,
            timestamp: new Date().toISOString(),
          };
        }
      }),
    );
  }
}
