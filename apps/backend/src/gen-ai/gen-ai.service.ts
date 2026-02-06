import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GenAiService {
  private readonly logger = new Logger(GenAiService.name);
  private genAI: GoogleGenerativeAI;
  private model: GenerativeModel;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    const modelName = this.configService.get<string>(
      'GOOGLE_AI_MODEL',
      'gemma-3-27b-it',
    );

    if (!apiKey) {
      this.logger.error('GOOGLE_AI_API_KEY is not defined');
      throw new Error('GOOGLE_AI_API_KEY is not defined');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  async generateText(prompt: string): Promise<string> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      this.logger.error('Failed to generate content', error);
      throw error;
    }
  }
}
