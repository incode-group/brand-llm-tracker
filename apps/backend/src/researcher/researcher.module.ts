import { Module } from '@nestjs/common';
import { ResearcherService } from './researcher.service';

@Module({
  providers: [ResearcherService],
  exports: [ResearcherService],
})
export class ResearcherModule {}
