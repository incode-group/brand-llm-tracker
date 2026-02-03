import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('start')
  async start(@Body() body: { brandName: string; domain: string }) {
    return this.analysisService.startAnalysis(body.brandName, body.domain);
  }
}
