import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ANALYSIS_QUEUE, AnalysisStep } from '../bullmq/constants';
import { Logger } from '@nestjs/common';
import { ResearcherService } from 'src/researcher/researcher.service';
import { LlmMentionsService } from 'src/llm-mentions/llm-mentions.service';
import { LlmResponsesService } from 'src/llm-responses/llm-responses.service';
import { Brand } from 'src/researcher/types';

@Processor(ANALYSIS_QUEUE, {
  concurrency: 20,
})
export class AnalysisProcessor extends WorkerHost {
  private readonly logger = new Logger(AnalysisProcessor.name);

  constructor(
    private readonly researcherService: ResearcherService, 
    private readonly llmMentionsService: LlmMentionsService, 
    private readonly llmResponsesService: LlmResponsesService
  ) {
    super();
  }

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
      case AnalysisStep.LLM_MENTIONS:
        return this.handleLlmMentions(job);
      case AnalysisStep.LLM_RESPONSES:
        return this.handleLlmResponses(job);

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleResearch(job: Job) {
    this.logger.log(`[Research] Starting for ${job.data.brandName}`);

    const { brandName: name, website, location } = job.data;

    try {
      const researchResult = await this.researcherService.analyzeBrand(
        name,
        website,
        location,
      );

      // this.progressGateway.sendProgress(analysisId, 30, 'Ресерч бренда завершен!');

      this.logger.log(`[Research] Completed for ${job.data.brandName}`);
      return {
        name,
        website,
        location,
        researchResult,
      } as Brand;
    } catch (error) {
      this.logger.error(`[Research] Failed for ${job.data.brandName}`, error);
      // this.progressGateway.sendProgress(analysisId, 0, 'Research erorr!');
      throw error;
    }
  }

  private async handleLlmMentions(job: Job) {

    const childrenValues = await job.getChildrenValues();
  
    const researchResult = Object.values(childrenValues)[0] as any;
    this.logger.log(`[LlmMentions] Starting for ${researchResult}`);

    try {
      // const result = await this.llmMentionsService.checkMentions(
      //   job.data.brandName,
      //   job.data.website,
      //   job.data.location,
      // );

      // this.progressGateway.sendProgress(analysisId, 30, 'Ресерч бренда завершен!');

      this.logger.log(`[LlmMentions] Completed for ${researchResult.name}`);
      // return result;
    } catch (error) {
      this.logger.error(`[LlmMentions] Failed for ${researchResult.name}`, error);
      // this.progressGateway.sendProgress(analysisId, 0, 'Research erorr!');
      throw error;
    }
  }

  private async handleLlmResponses(job: Job) {

    const childrenValues = await job.getChildrenValues();
  
    const researchResult = Object.values(childrenValues)[0] as any;

    this.logger.log(`[LlmResponses] Starting for ${researchResult.name}`);

    try {
      const llmResponsesResult = await this.llmResponsesService.processHarvest(
        researchResult
      );

      // this.progressGateway.sendProgress(analysisId, 30, 'Ресерч бренда завершен!');

      this.logger.log(`[LlmResponses] Completed for ${job.data.brandName}`);
      // return result;
    } catch (error) {
      this.logger.error(`[LlmResponses] Failed for ${job.data.brandName}`, error);
      // this.progressGateway.sendProgress(analysisId, 0, 'Research erorr!');
      throw error;
    }
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
