import { Module } from '@nestjs/common';
import { LlmMentionsService } from './llm-mentions.service';

@Module({
  providers: [LlmMentionsService],
  exports: [LlmMentionsService],
})
export class LlmMentionsModule {}
