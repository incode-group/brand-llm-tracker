import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ANALYSIS_QUEUE, AnalysisStep } from '../bullmq/constants';
import { Logger } from '@nestjs/common';

@Processor(ANALYSIS_QUEUE, {
  concurrency: 20,
})
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.name} (ID: ${job.id})`);

    switch (job.name) {
      case AnalysisStep.RESEARCH:
        return this.handleResearch(job);
      case AnalysisStep.HARVEST:
        return this.handleHarvest(job);
      case AnalysisStep.JUDGE:
        return this.handleJudge(job);
      case AnalysisStep.AGGREGATE:
        return this.handleAggregate(job);
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleResearch(job: Job) {
    this.logger.log(`[Research] Starting for ${job.data.brandName}`);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay
    this.logger.log(`[Research] Completed for ${job.data.brandName}`);
    return { niche: 'Tech', competitors: ['CompA', 'CompB'] };
  }

  private async handleHarvest(job: Job) {
    this.logger.log(`[Harvest] Fetching prompt ${job.data.promptIndex}`);
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
    return { rawResponse: 'Mock LLM Response' };
  }

  private async handleJudge(job: Job) {
    // Note: In a Flow, Judge might be part of Harvest or a separate step if structured that way.
    // For now, let's keep it simple.
    return { score: 85 };
  }

  private async handleAggregate(job: Job) {
    this.logger.log(`[Aggregate] Finalizing analysis ${job.data.analysisId}`);
    // Here we would collect children results using job.getChildrenValues()
    const childrenValues = await job.getChildrenValues();
    this.logger.log(`Collected ${Object.keys(childrenValues).length} results`);
    return { finalScore: 85 };
  }
}
