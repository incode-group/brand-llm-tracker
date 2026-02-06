import { Module, Global } from '@nestjs/common';
import { GenAiService } from './gen-ai.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [GenAiService],
  exports: [GenAiService],
})
export class GenAiModule {}
