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

  async startAnalysis(brandName: string, website: string, location: string) {
    const analysisId = uuidv4();

    const researchJobId = `research-${analysisId}`;
    const mentionsResearchId = `research-mentions-${analysisId}`;
    const responsesResearchId = `research-responses-${analysisId}`;

    // Strategy: Parent-Child Flow
    // Step A (Sequential): Research & Preparation
    // Step B (Parallel Burst): Harvest (Multiple LLMs/Prompts)
    // Step C (Aggregation): Final Scoring/Analysis

    await this.flowProducer.add({
      name: AnalysisStep.AGGREGATE,
      queueName: ANALYSIS_QUEUE,
      data: { analysisId, brandName, website },
      children: [
        {
          name: AnalysisStep.LLM_MENTIONS,
          queueName: ANALYSIS_QUEUE,
          data: { analysisId, promptIndex: 1 },
          // children: [
          //   {
          //     name: AnalysisStep.RESEARCH,
          //     queueName: ANALYSIS_QUEUE,
          //     data: { analysisId, brandName, website, location },
          //     opts: {
          //       jobId: mentionsResearchId,
          //     },
          //   },
          // ],
        },
        {
          name: AnalysisStep.LLM_RESPONSES,
          queueName: ANALYSIS_QUEUE,
          data: { analysisId, promptIndex: 1 },
          children: [
            {
              name: AnalysisStep.RESEARCH,
              queueName: ANALYSIS_QUEUE,
              data: { analysisId, brandName, website, location },
              opts: {
                jobId: responsesResearchId,
              },
            },
          ],
        },
      ],
    });

    return { analysisId, status: 'PENDING' };
  }
}
