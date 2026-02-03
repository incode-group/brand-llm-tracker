import { Injectable } from '@nestjs/common';
import { InjectFlowProducer } from '@nestjs/bullmq';
import { FlowProducer } from 'bullmq';
import { ANALYSIS_QUEUE, AnalysisStep } from '../bullmq/constants';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectFlowProducer(ANALYSIS_QUEUE)
    private readonly flowProducer: FlowProducer,
  ) {}

  async startAnalysis(brandName: string, domain: string) {
    const analysisId = uuidv4();

    // Strategy: Parent-Child Flow
    // Step A (Sequential): Research & Preparation
    // Step B (Parallel Burst): Harvest (Multiple LLMs/Prompts)
    // Step C (Aggregation): Final Scoring/Analysis

    await this.flowProducer.add({
      name: AnalysisStep.AGGREGATE,
      queueName: ANALYSIS_QUEUE,
      data: { analysisId, brandName, domain },
      children: [
        {
          name: AnalysisStep.HARVEST,
          queueName: ANALYSIS_QUEUE,
          data: { analysisId, promptIndex: 1 },
          children: [
            {
              name: AnalysisStep.RESEARCH,
              queueName: ANALYSIS_QUEUE,
              data: { analysisId, brandName, domain },
            },
          ],
        },
        // In a real scenario, multiple harvest jobs would be added here
        {
          name: AnalysisStep.HARVEST,
          queueName: ANALYSIS_QUEUE,
          data: { analysisId, promptIndex: 2 },
          // children: [same research job] - BullMQ handles shared dependencies via IDs, 
          // but for simplicity in this PoC, we might structure it differently or use fixed IDs.
        },
      ],
    });

    return { analysisId, status: 'PENDING' };
  }
}
